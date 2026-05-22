const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../utils/database');
const { success, error } = require('../utils/response');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return error(res, 'Email dan password diperlukan');
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return error(res, 'Email atau password salah', 401);
  if (!bcrypt.compareSync(password, user.password_hash)) return error(res, 'Email atau password salah', 401);
  if (user.subscription_end && new Date(user.subscription_end) < new Date()) {
    db.run('UPDATE users SET unlimited = 0 WHERE id = ?', [user.id]);
    user.unlimited = 0;
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET, { expiresIn: '7d' });
  return success(res, { token, role: user.role, unlimited: user.unlimited, credits: user.credits, subscription_end: user.subscription_end, referral_code: user.referral_code });
});

router.post('/register', (req, res) => {
  const { email, password, referral_code } = req.body;
  if (!email || !password) return error(res, 'Email dan password diperlukan');
  const db = getDb();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return error(res, 'Email sudah terdaftar', 409);
  const passwordHash = bcrypt.hashSync(password, 10);
  const referralCodeOwn = Math.random().toString(36).substring(2, 10).toUpperCase();
  if (referral_code) {
    const referrer = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(referral_code);
    if (referrer) {
      const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate() + 3);
      db.run('UPDATE users SET subscription_end = ?, unlimited = 1 WHERE id = ?', [trialEnd.toISOString(), referrer.id]);
      db.run('INSERT INTO referrals (referrer_id, referred_email) VALUES (?, ?)', [referrer.id, email]);
    }
  }
  db.run('INSERT INTO users (email, password_hash, referral_code, referred_by) VALUES (?, ?, ?, ?)', [email, passwordHash, referralCodeOwn, referral_code || null]);
  return success(res, { message: 'Registrasi berhasil' }, 201);
});

router.get('/credits', (req, res) => {
  const user = getDb().prepare('SELECT unlimited, credits, subscription_end, referral_code FROM users WHERE id = ?').get(req.user.id);
  return success(res, user);
});

router.post('/api-key', (req, res) => {
  const { provider, key } = req.body;
  if (!provider || !key) return error(res, 'Provider dan key diperlukan');
  const encrypted = Buffer.from(key).toString('base64');
  getDb().run('INSERT INTO api_keys (user_id, provider, encrypted_key) VALUES (?, ?, ?)', [req.user.id, provider, encrypted]);
  return success(res, { message: 'API key ditambahkan' });
});

router.get('/api-keys', (req, res) => {
  const keys = getDb().prepare('SELECT id, provider, is_active, created_at FROM api_keys WHERE user_id = ?').all(req.user.id);
  return success(res, keys);
});

router.delete('/api-key/:id', (req, res) => {
  getDb().run('DELETE FROM api_keys WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  return success(res, { message: 'API key dihapus' });
});

router.get('/referral', (req, res) => {
  const user = getDb().prepare('SELECT referral_code FROM users WHERE id = ?').get(req.user.id);
  return success(res, { referral_code: user.referral_code });
});

module.exports = router;