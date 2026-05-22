const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../utils/database');
const { success, error } = require('../utils/response');

// POST /api/v1/user/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return error(res, 'Email dan password diperlukan');
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return error(res, 'Email atau password salah', 401);
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return error(res, 'Email atau password salah', 401);
  // Check if subscription expired
  if (user.subscription_end && new Date(user.subscription_end) < new Date()) {
    // Reset unlimited if expired
    db.prepare('UPDATE users SET unlimited = 0 WHERE id = ?').run(user.id);
    user.unlimited = 0;
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET, { expiresIn: '7d' });
  return success(res, { token, role: user.role, unlimited: user.unlimited, credits: user.credits, subscription_end: user.subscription_end, referral_code: user.referral_code });
});

// POST /api/v1/user/register
router.post('/register', (req, res) => {
  const { email, password, referral_code } = req.body;
  if (!email || !password) return error(res, 'Email dan password diperlukan');
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return error(res, 'Email sudah terdaftar', 409);
  
  const passwordHash = bcrypt.hashSync(password, 10);
  const referralCodeOwn = Math.random().toString(36).substring(2, 10).toUpperCase();
  let referrerId = null;
  if (referral_code) {
    const referrer = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(referral_code);
    if (referrer) {
      referrerId = referrer.id;
      // Beri trial 3 hari untuk referrer
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 3);
      db.prepare('UPDATE users SET subscription_end = ? WHERE id = ?').run(trialEnd.toISOString(), referrer.id);
      db.prepare('UPDATE users SET unlimited = 1 WHERE id = ?').run(referrer.id);
      // Catat referral
      db.prepare('INSERT INTO referrals (referrer_id, referred_email) VALUES (?, ?)').run(referrer.id, email);
    }
  }
  
  db.prepare('INSERT INTO users (email, password_hash, referral_code, referred_by) VALUES (?, ?, ?, ?)')
    .run(email, passwordHash, referralCodeOwn, referral_code || null);
  
  return success(res, { message: 'Registrasi berhasil' }, 201);
});

// GET /api/v1/user/credits
router.get('/credits', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT unlimited, credits, subscription_end, referral_code FROM users WHERE id = ?').get(req.user.id);
  return success(res, user);
});

// POST /api/v1/user/api-key (tambah API key pribadi)
router.post('/api-key', (req, res) => {
  const { provider, key } = req.body;
  if (!provider || !key) return error(res, 'Provider dan key diperlukan');
  const db = getDb();
  const encrypted = Buffer.from(key).toString('base64');
  db.prepare('INSERT INTO api_keys (user_id, provider, encrypted_key) VALUES (?, ?, ?)').run(req.user.id, provider, encrypted);
  return success(res, { message: 'API key ditambahkan' });
});

// GET /api/v1/user/api-keys
router.get('/api-keys', (req, res) => {
  const db = getDb();
  const keys = db.prepare('SELECT id, provider, is_active, created_at FROM api_keys WHERE user_id = ?').all(req.user.id);
  return success(res, keys);
});

// DELETE /api/v1/user/api-key/:id
router.delete('/api-key/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  return success(res, { message: 'API key dihapus' });
});

// GET /api/v1/user/referral (kode undangan user)
router.get('/referral', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT referral_code FROM users WHERE id = ?').get(req.user.id);
  return success(res, { referral_code: user.referral_code });
});

module.exports = router;