/**
 * kreaverse-ai - User endpoints (credits, keys, invite)
 *
 * PENTING: User TIDAK perlu mengisi Environment Variables di Vercel.
 * Cukup login → buka "🔑 API Key Saya" → tambahkan key → klik "Simpan & Cek Otomatis".
 * Key disimpan in-memory di server (per-session). Untuk persisten gunakan DB.
 */
const express = require('express');
const { authRequired, login, register, createInvite, redeemInvite } = require('../middleware/auth');

const router = express.Router();

// in-memory user-keys store: email -> { [PROVIDER_ENV]: [keys] }
const KEYS = new Map();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const r = login(email, password);
  if (!r.ok) return res.status(401).json(r);
  res.json(r);
});

router.post('/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, error: 'email & password wajib' });
  res.json(register(email, password));
});

router.get('/credits', (req, res) => {
  res.json({ ok: true, data: { plan: req.user?.plan || 'guest', credits: req.user?.plan === 'unlimited' ? 'unlimited' : 0 } });
});

// === API key management ===
router.get('/keys', authRequired, (req, res) => {
  res.json({ ok: true, data: KEYS.get(req.user.email) || {} });
});

router.post('/keys', authRequired, (req, res) => {
  const { provider, key, enabled = true } = req.body || {};
  if (!provider || !key) return res.status(400).json({ ok: false, error: 'provider & key wajib' });
  const bucket = KEYS.get(req.user.email) || {};
  bucket[provider] = bucket[provider] || [];
  if (bucket[provider].length >= 25) return res.status(400).json({ ok: false, error: 'Maks 25 key/provider' });
  bucket[provider].push({ key, enabled, status: 'pending', addedAt: Date.now() });
  KEYS.set(req.user.email, bucket);
  res.json({ ok: true, data: bucket[provider] });
});

router.delete('/keys', authRequired, (req, res) => {
  const { provider, index } = req.body || {};
  const bucket = KEYS.get(req.user.email) || {};
  if (!provider) { KEYS.delete(req.user.email); return res.json({ ok: true, data: {} }); }
  if (typeof index === 'number' && bucket[provider]) {
    bucket[provider].splice(index, 1);
  } else {
    delete bucket[provider];
  }
  KEYS.set(req.user.email, bucket);
  res.json({ ok: true, data: bucket });
});

router.post('/keys/check', authRequired, async (req, res) => {
  const bucket = KEYS.get(req.user.email) || {};
  const axios = require('axios');
  const checks = {
    KIE_AI_API_KEY:     { url: 'https://api.kie.ai/v1/user/credits',                  hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    DEEPSEEK_API_KEY:   { url: 'https://api.deepseek.com/user/balance',               hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    LEONARDO_API_KEY:   { url: 'https://cloud.leonardo.ai/api/rest/v1/me',            hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    OPENAI_API_KEY:     { url: 'https://api.openai.com/v1/models',                    hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    GEMINI_API_KEY:     { url: 'https://generativelanguage.googleapis.com/v1beta/models', hdr: (k) => ({ 'x-goog-api-key': k }) },
    GROK_API_KEY:       { url: 'https://api.x.ai/v1/models',                          hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    ANTHROPIC_API_KEY:  { url: 'https://api.anthropic.com/v1/models',                 hdr: (k) => ({ 'x-api-key': k, 'anthropic-version': '2023-06-01' }) },
    SUNO_API_KEY:       { url: 'https://api.sunoapi.org/api/v1/credit',               hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    APIFRAME_API_KEY:   { url: 'https://api.apiframe.ai/v1/account',                  hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    CRUN_AI_API_KEY:    { url: 'https://api.crun.ai/v1/user/credits',                 hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    APIBOX_API_KEY:     { url: 'https://api.box/v1/user/me',                          hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    EVOLINK_API_KEY:    { url: 'https://api.evolink.ai/v1/user/me',                   hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
    AIMASTERING_API_KEY:{ url: 'https://aimastering.com/api/v1/users/me',             hdr: (k) => ({ Authorization: `Bearer ${k}` }) },
  };
  for (const [prov, arr] of Object.entries(bucket)) {
    for (const item of arr) {
      try {
        if (!item.enabled) { item.status = 'off'; continue; }
        const c = checks[prov];
        if (!c) { item.status = 'unknown'; continue; }
        const r = await axios.get(c.url, { headers: c.hdr(item.key), timeout: 8000, validateStatus: () => true });
        item.status = r.status < 400 ? 'active' : 'inactive';
        item.lastChecked = Date.now();
      } catch { item.status = 'inactive'; }
    }
  }
  KEYS.set(req.user.email, bucket);
  res.json({ ok: true, data: bucket });
});

// === Invite friend ===
router.post('/invite', authRequired, (req, res) => {
  const code = createInvite(req.user.email);
  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({ ok: true, data: { code, inviteUrl: `${baseUrl}/invite?code=${code}` } });
});

router.post('/invite/redeem', authRequired, (req, res) => {
  const { code } = req.body || {};
  const r = redeemInvite(code, req.user.email);
  if (!r.ok) return res.status(400).json(r);
  res.json({ ok: true, data: r });
});

/**
 * Middleware: attach user keys ke req sebelum endpoint jobs.
 * - Jika header X-KV-Key-Mode=user, pakai key user (failover: pertama yang aktif/pending).
 * - Jika unlimited, biarkan kosong → adapter fallback ke env owner.
 */
function attachUserKeys(req, _res, next) {
  const mode = req.headers['x-kv-key-mode'] || 'unlimited';
  if (mode === 'user' && req.user?.email) {
    const bucket = KEYS.get(req.user.email) || {};
    req.userKeys = {};
    for (const [prov, arr] of Object.entries(bucket)) {
      // Pilih key pertama yang enabled & tidak inactive (failover otomatis)
      const active = arr.find((x) => x.enabled && x.status !== 'inactive' && x.status !== 'off');
      if (active) req.userKeys[prov] = active.key;
    }
  } else {
    req.userKeys = {};
  }
  next();
}

module.exports = router;
module.exports.attachUserKeys = attachUserKeys;
