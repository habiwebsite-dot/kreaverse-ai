const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const db = require('../database/db');
const { success, error } = require('../utils/response');
const { validateCreateUser } = require('../utils/validator');
const { uploadBuffer } = require('../utils/cloudinary');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  return success(res, db.getStats());
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  return success(res, db.getAllUsers());
});

// POST /api/admin/users (buat user baru)
router.post('/users', async (req, res) => {
  const errs = validateCreateUser(req.body);
  if (errs.length) return error(res, errs.join(', '), 400);
  
  const { email, password, name, subscriptionEnd } = req.body;
  const existing = db.getUserByEmail(email.toLowerCase());
  if (existing) return error(res, 'Email sudah terdaftar', 409);
  
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const referralCode = generateReferralCode();
  
  db.createUser({ id, email: email.toLowerCase(), passwordHash: hash, name, subscriptionEnd, referralCode });
  return success(res, { id, email, name, subscriptionEnd, referralCode }, 'User berhasil dibuat', 201);
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  const { name, password, subscriptionEnd, isActive } = req.body;
  const fields = {};
  if (name) fields.name = name;
  if (password) fields.password_hash = await bcrypt.hash(password, 10);
  if (subscriptionEnd) fields.subscription_end = subscriptionEnd;
  if (isActive !== undefined) fields.is_active = isActive ? 1 : 0;
  
  db.updateUser(req.params.id, fields);
  return success(res, null, 'User berhasil diupdate');
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  db.deleteUser(req.params.id);
  return success(res, null, 'User berhasil dihapus');
});

// GET /api/admin/api-keys
router.get('/api-keys', (req, res) => {
  const keys = db.getAllApiKeys().map(k => ({
    id: k.id, provider: k.provider, label: k.label,
    status: k.status, addedAt: k.added_at, userEmail: k.user_email,
    keyPreview: maskKey(k.api_key_encrypted)
  }));
  return success(res, keys);
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  return success(res, db.getAdminSettings());
});

// PUT /api/admin/settings
router.put('/settings', (req, res) => {
  const allowed = ['subscriptionPrice', 'promoBanner', 'promoPopup'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      db.setAdminSetting(key, req.body[key]);
    }
  }
  return success(res, null, 'Pengaturan berhasil disimpan');
});

// POST /api/admin/upload/logo
router.post('/upload/logo', upload.single('file'), async (req, res) => {
  if (!req.file) return error(res, 'File tidak ditemukan', 400);
  const result = await uploadBuffer(req.file.buffer, req.file.mimetype, 'logo.png', 'branding');
  if (!result.success) return error(res, result.error, 500);
  db.setAdminSetting('logo', result.url);
  return success(res, { url: result.url }, 'Logo berhasil diupload');
});

// POST /api/admin/upload/qr
router.post('/upload/qr', upload.single('file'), async (req, res) => {
  if (!req.file) return error(res, 'File tidak ditemukan', 400);
  const result = await uploadBuffer(req.file.buffer, req.file.mimetype, 'payment-qr.png', 'branding');
  if (!result.success) return error(res, result.error, 500);
  db.setAdminSetting('paymentQr', result.url);
  return success(res, { url: result.url }, 'QR berhasil diupload');
});

// POST /api/admin/upload/provider-logo
router.post('/upload/provider-logo', upload.single('file'), async (req, res) => {
  const { provider } = req.body;
  if (!provider || !req.file) return error(res, 'provider dan file wajib diisi', 400);
  const result = await uploadBuffer(req.file.buffer, req.file.mimetype, `${provider}.png`, 'providers');
  if (!result.success) return error(res, result.error, 500);
  db.setAdminSetting(`logo_${provider}`, result.url);
  return success(res, { url: result.url, provider }, 'Logo provider berhasil diupload');
});

// POST /api/admin/promo
router.post('/promo', (req, res) => {
  const { type, content, isActive } = req.body;
  if (!content) return error(res, 'content wajib diisi', 400);
  const key = type === 'popup' ? 'promoPopup' : 'promoBanner';
  db.setAdminSetting(key, isActive ? JSON.stringify({ content, type }) : null);
  return success(res, null, 'Promo berhasil disimpan');
});

// GET /api/admin/downloads
router.get('/downloads', (req, res) => {
  const downloads = db.getDb().prepare(`
    SELECT d.*, u.email as user_email FROM downloads d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.downloaded_at DESC LIMIT 200
  `).all();
  return success(res, downloads);
});

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function maskKey(encrypted) {
  if (!encrypted) return '****';
  return encrypted.slice(0, 6) + '...' + encrypted.slice(-4);
}

module.exports = router;