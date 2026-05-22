const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { encrypt, decrypt } = require('../utils/encryption');
const { success, error } = require('../utils/response');
const { validateApiKey } = require('../utils/validator');
const request = require('../utils/request');

// GET /api/v1/user/credits
router.get('/credits', (req, res) => {
  const user = req.user;
  const isActive = db.isUserActive(user);
  return success(res, {
    isActive,
    isUnlimited: isActive,
    subscriptionEnd: user.subscription_end,
    trialEndsAt: user.trial_ends_at,
    daysRemaining: calculateDaysRemaining(user),
    plan: isActive ? 'unlimited' : 'expired'
  });
});

function calculateDaysRemaining(user) {
  const now = new Date();
  let endDate = null;
  if (user.subscription_end) endDate = new Date(user.subscription_end);
  if (user.trial_ends_at) {
    const trialDate = new Date(user.trial_ends_at);
    if (!endDate || trialDate > endDate) endDate = trialDate;
  }
  if (!endDate) return 0;
  const diff = endDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// GET /api/v1/user/dashboard
router.get('/dashboard', (req, res) => {
  const tasks = db.getUserTasks(req.user.id, 10);
  const downloads = db.getUserDownloads(req.user.id, 10);
  const activeTasks = tasks.filter(t => t.state === 0 || t.state === 1);
  return success(res, {
    activeTasks: activeTasks.length,
    recentTasks: tasks,
    recentDownloads: downloads,
    subscription: {
      isActive: db.isUserActive(req.user),
      end: req.user.subscription_end,
      trial: req.user.trial_ends_at,
      daysRemaining: calculateDaysRemaining(req.user)
    }
  });
});

// GET /api/v1/user/history
router.get('/history', (req, res) => {
  const { category, limit = 50 } = req.query;
  let tasks = db.getUserTasks(req.user.id, parseInt(limit));
  if (category) tasks = tasks.filter(t => t.category === category);
  return success(res, tasks);
});

// GET /api/v1/user/downloads
router.get('/downloads', (req, res) => {
  const downloads = db.getUserDownloads(req.user.id);
  return success(res, downloads);
});

// ─── API Key Management ───────────────────────────────────────────────────────
// GET /api/v1/user/api-keys
router.get('/api-keys', (req, res) => {
  const keys = db.getUserApiKeys(req.user.id);
  const sanitized = keys.map(k => ({
    id: k.id, provider: k.provider, label: k.label,
    status: k.status, lastChecked: k.last_checked, addedAt: k.added_at,
    keyPreview: maskApiKey(decrypt(k.api_key_encrypted) || '')
  }));
  return success(res, sanitized);
});

// POST /api/v1/user/api-keys
router.post('/api-keys', (req, res) => {
  const errs = validateApiKey(req.body);
  if (errs.length) return error(res, errs.join(', '), 400);
  const { provider, apiKey, label } = req.body;
  const encrypted = encrypt(apiKey);
  const id = uuidv4();
  db.addApiKey({ id, userId: req.user.id, provider, apiKeyEncrypted: encrypted, label: label || provider });
  return success(res, { id, provider, label, status: 'unknown', keyPreview: maskApiKey(apiKey) }, 'API key berhasil ditambahkan', 201);
});

// DELETE /api/v1/user/api-keys/:id
router.delete('/api-keys/:id', (req, res) => {
  db.deleteApiKey(req.params.id, req.user.id);
  return success(res, null, 'API key berhasil dihapus');
});

// POST /api/v1/user/api-keys/:id/check
router.post('/api-keys/:id/check', async (req, res) => {
  const keys = db.getUserApiKeys(req.user.id);
  const keyRecord = keys.find(k => k.id === req.params.id);
  if (!keyRecord) return error(res, 'API key tidak ditemukan', 404);
  
  const plainKey = decrypt(keyRecord.api_key_encrypted);
  const status = await checkApiKeyStatus(keyRecord.provider, plainKey);
  db.updateApiKeyStatus(keyRecord.id, status);
  return success(res, { id: keyRecord.id, status });
});

async function checkApiKeyStatus(provider, apiKey) {
  try {
    const providerChecks = {
      'deepseek': async () => {
        const r = await request.get('https://api.deepseek.com/user/balance', {}, { Authorization: `Bearer ${apiKey}` });
        return r.success ? 'active' : 'inactive';
      },
      'gemini': async () => {
        const r = await request.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        return r.success ? 'active' : 'inactive';
      },
      'grok': async () => {
        const r = await request.get('https://api.x.ai/v1/models', {}, { Authorization: `Bearer ${apiKey}` });
        return r.success ? 'active' : 'inactive';
      },
      'leonardo': async () => {
        const r = await request.get('https://cloud.leonardo.ai/api/rest/v1/me', {}, { Authorization: `Bearer ${apiKey}` });
        return r.success ? 'active' : 'inactive';
      }
    };
    
    if (providerChecks[provider]) {
      return await providerChecks[provider]();
    }
    // For others, assume active (no standard check endpoint)
    return 'unknown';
  } catch {
    return 'error';
  }
}

function maskApiKey(key) {
  if (!key || key.length < 8) return '****';
  return key.slice(0, 4) + '****' + key.slice(-4);
}

module.exports = router;