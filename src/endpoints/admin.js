const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../utils/database');
const { success, error } = require('../utils/response');

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Token diperlukan' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Akses ditolak' });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, 'admin');
  if (!user) return error(res, 'Email atau password salah', 401);
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return error(res, 'Email atau password salah', 401);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET, { expiresIn: '1d' });
  return success(res, { token });
});

router.get('/users', adminAuth, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, email, role, subscription_end, unlimited, credits, created_at FROM users').all();
  return success(res, users);
});

router.post('/users', adminAuth, (req, res) => {
  const { email, password, subscription_end, unlimited, credits } = req.body;
  if (!email || !password) return error(res, 'Email dan password diperlukan');
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return error(res, 'Email sudah terdaftar', 409);
  const passwordHash = bcrypt.hashSync(password, 10);
  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  db.prepare('INSERT INTO users (email, password_hash, role, subscription_end, unlimited, credits, referral_code) VALUES (?,?,?,?,?,?,?)')
    .run(email, passwordHash, 'user', subscription_end || null, unlimited || 0, credits || 0, referralCode);
  return success(res, { message: 'User berhasil dibuat' });
});

router.put('/users/:id', adminAuth, (req, res) => {
  const { subscription_end, unlimited, credits } = req.body;
  const db = getDb();
  db.prepare('UPDATE users SET subscription_end=?, unlimited=?, credits=? WHERE id=?')
    .run(subscription_end, unlimited, credits, req.params.id);
  return success(res, { message: 'User diperbarui' });
});

router.get('/api-keys', adminAuth, (req, res) => {
  const db = getDb();
  const keys = db.prepare(`
    SELECT a.id, a.user_id, u.email, a.provider, a.encrypted_key, a.is_active, a.created_at 
    FROM api_keys a JOIN users u ON a.user_id = u.id
  `).all();
  keys.forEach(k => {
    k.decrypted_key = Buffer.from(k.encrypted_key, 'base64').toString('utf-8');
  });
  return success(res, keys);
});

router.get('/referrals', adminAuth, (req, res) => {
  const db = getDb();
  const refs = db.prepare('SELECT r.*, u.email as referrer_email FROM referrals r JOIN users u ON r.referrer_id = u.id').all();
  return success(res, refs);
});

router.get('/settings', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const settingsPath = path.join(__dirname, '..', '..', 'config', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    return success(res, JSON.parse(data));
  }
  return success(res, {});
});

router.post('/settings', adminAuth, (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const settingsPath = path.join(__dirname, '..', '..', 'config', 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2));
  return success(res, { message: 'Pengaturan disimpan' });
});

module.exports = router;