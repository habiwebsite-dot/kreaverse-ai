const jwt = require('jsonwebtoken');
const { getDb } = require('../utils/database');
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    const user = getDb().prepare('SELECT id, email, role, unlimited, credits, subscription_end FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User tidak valid' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};