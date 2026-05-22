const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { generateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { validateLogin } = require('../utils/validator');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const errs = validateLogin(req.body);
  if (errs.length) return error(res, errs.join(', '), 400);
  
  const { email, password } = req.body;
  const user = db.getUserByEmail(email.toLowerCase().trim());
  if (!user) return error(res, 'Email atau password salah', 401);
  if (!user.is_active) return error(res, 'Akun tidak aktif. Hubungi admin.', 403);
  
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return error(res, 'Email atau password salah', 401);
  
  const token = generateToken(user);
  req.session.token = token;
  
  return success(res, {
    token,
    user: {
      id: user.id, email: user.email, name: user.name,
      role: user.role, subscriptionEnd: user.subscription_end,
      trialEndsAt: user.trial_ends_at, isActive: db.isUserActive(user)
    }
  }, 'Login berhasil');
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  return success(res, null, 'Logout berhasil');
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.session?.token;
  if (!token) return error(res, 'Tidak terautentikasi', 401);
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kreaverse-jwt-fallback');
    const user = db.getUserById(decoded.id);
    if (!user) return error(res, 'Pengguna tidak ditemukan', 404);
    
    return success(res, {
      id: user.id, email: user.email, name: user.name,
      role: user.role, subscriptionEnd: user.subscription_end,
      trialEndsAt: user.trial_ends_at, isActive: db.isUserActive(user),
      referralCode: user.referral_code
    });
  } catch {
    return error(res, 'Token tidak valid', 401);
  }
});

module.exports = router;