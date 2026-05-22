const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { error } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'kreaverse-jwt-fallback';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.session?.token;
  
  if (!token) return error(res, 'Token tidak ditemukan. Silakan login.', 401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.id);
    if (!user) return error(res, 'Pengguna tidak ditemukan', 401);
    if (!user.is_active) return error(res, 'Akun tidak aktif', 403);
    if (!db.isUserActive(user) && user.role !== 'admin') {
      return error(res, 'Langganan Anda telah berakhir. Silakan perpanjang.', 403);
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Token kadaluarsa. Silakan login ulang.', 401);
    return error(res, 'Token tidak valid', 401);
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'admin') return error(res, 'Akses ditolak. Hanya admin.', 403);
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.session?.token;
  if (!token) { req.user = null; return next(); }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = db.getUserById(decoded.id);
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { generateToken, verifyToken, verifyAdmin, optionalAuth };