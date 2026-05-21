/**
 * kreaverse-ai - auth middleware (simple JWT)
 * Default owner account dibaca dari ENV.
 */
const jwt = require('jsonwebtoken');

const SECRET = () => process.env.JWT_SECRET || 'kreaverse-ai-dev-secret';
const OWNER_EMAIL = () => process.env.OWNER_EMAIL || 'habistudio.ai@unlimited.com';
const OWNER_PASS  = () => process.env.OWNER_PASSWORD || 'habi.studio.com';

// In-memory user store (untuk demo). Production -> ganti DB.
const users = new Map();
const invites = new Map();   // code -> ownerEmail
const trials  = new Map();   // email -> expiresAt

function ensureOwner() {
  if (!users.has(OWNER_EMAIL())) {
    users.set(OWNER_EMAIL(), {
      email: OWNER_EMAIL(),
      password: OWNER_PASS(),
      plan: 'unlimited',
      createdAt: Date.now(),
    });
  }
}

function signToken(user) {
  return jwt.sign(
    { email: user.email, plan: user.plan },
    SECRET(),
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  try { return jwt.verify(token, SECRET()); } catch { return null; }
}

function authRequired(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : (req.query.token || req.cookies?.kv_token);
  const payload = token && verifyToken(token);
  if (!payload) return res.status(401).json({ ok: false, error: 'Login dibutuhkan' });
  req.user = payload;
  next();
}

function login(email, password) {
  ensureOwner();
  const u = users.get((email || '').toLowerCase()) || users.get(email);
  if (!u || u.password !== password) {
    // cek trial
    const exp = trials.get(email);
    if (exp && exp > Date.now()) {
      return { ok: true, token: signToken({ email, plan: 'trial' }), user: { email, plan: 'trial' } };
    }
    return { ok: false, error: 'Email atau password salah' };
  }
  return { ok: true, token: signToken(u), user: { email: u.email, plan: u.plan } };
}

function register(email, password) {
  ensureOwner();
  if (users.has(email)) return { ok: false, error: 'Email sudah terdaftar' };
  users.set(email, { email, password, plan: 'free', createdAt: Date.now() });
  return { ok: true };
}

function createInvite(ownerEmail) {
  const code = 'KV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  invites.set(code, ownerEmail);
  return code;
}

function redeemInvite(code, email) {
  if (!invites.has(code)) return { ok: false, error: 'Kode undangan tidak valid' };
  const expires = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 hari
  trials.set(email, expires);
  return { ok: true, expiresAt: expires };
}

module.exports = {
  authRequired,
  login,
  register,
  signToken,
  verifyToken,
  createInvite,
  redeemInvite,
  ensureOwner,
};
