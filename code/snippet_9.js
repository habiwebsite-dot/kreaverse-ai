const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DATABASE_URL || path.join(__dirname, '../../data/kreaverse.db');

// Pastikan folder data ada
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initialize() {
  const database = getDb();
  
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      subscription_start TEXT,
      subscription_end TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      referral_code TEXT UNIQUE,
      referred_by TEXT,
      trial_ends_at TEXT
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      api_key_encrypted TEXT NOT NULL,
      label TEXT,
      status TEXT DEFAULT 'unknown',
      last_checked TEXT,
      added_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      task_id TEXT,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      state INTEGER DEFAULT 0,
      input_json TEXT,
      result_json TEXT,
      error_message TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS downloads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT,
      category TEXT,
      downloaded_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL,
      referred_id TEXT NOT NULL,
      code TEXT NOT NULL,
      rewarded_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (referrer_id) REFERENCES users(id),
      FOREIGN KEY (referred_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS promo_banners (
      id TEXT PRIMARY KEY,
      type TEXT DEFAULT 'banner',
      content TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Default admin settings
  const defaults = [
    ['logo', '/images/logo.png'],
    ['paymentQr', '/images/payment-qr.png'],
    ['subscriptionPrice', '700000'],
    ['promoBanner', null],
    ['promoPopup', null]
  ];

  const insertSetting = database.prepare(
    'INSERT OR IGNORE INTO admin_settings (key, value) VALUES (?, ?)'
  );
  defaults.forEach(([k, v]) => insertSetting.run(k, v));

  // Create default admin user if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'habistudio.ai@unlimited.com';
  const adminExists = database.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!adminExists) {
    const { v4: uuidv4 } = require('uuid');
    let adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminHash) {
      adminHash = bcrypt.hashSync('habi.studio.com', 10);
    }
    database.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, ?, ?, ?, 'admin', 1)
    `).run(uuidv4(), adminEmail, adminHash, 'Admin Kreaverse');
    console.log('[DB] Admin user created');
  }

  console.log('[DB] Database initialized at', DB_PATH);
}

// ─── User Operations ─────────────────────────────────────────────────────────
function createUser({ id, email, passwordHash, name, subscriptionEnd, referralCode }) {
  const database = getDb();
  return database.prepare(`
    INSERT INTO users (id, email, password_hash, name, subscription_start, subscription_end, referral_code)
    VALUES (?, ?, ?, ?, datetime('now'), ?, ?)
  `).run(id, email, passwordHash, name, subscriptionEnd, referralCode);
}

function getUserByEmail(email) {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function getUserById(id) {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function getAllUsers() {
  return getDb().prepare(`
    SELECT id, email, name, role, is_active, subscription_start, subscription_end, 
           created_at, referral_code, trial_ends_at
    FROM users WHERE role != 'admin' ORDER BY created_at DESC
  `).all();
}

function updateUser(id, fields) {
  const database = getDb();
  const keys = Object.keys(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  return database.prepare(`UPDATE users SET ${setClause} WHERE id = ?`)
    .run(...Object.values(fields), id);
}

function deleteUser(id) {
  return getDb().prepare('DELETE FROM users WHERE id = ?').run(id);
}

function isUserActive(user) {
  if (!user || !user.is_active) return false;
  if (user.role === 'admin') return true;
  const now = new Date();
  if (user.trial_ends_at && new Date(user.trial_ends_at) > now) return true;
  if (user.subscription_end && new Date(user.subscription_end) > now) return true;
  return false;
}

// ─── Task Operations ─────────────────────────────────────────────────────────
function createTask({ id, userId, provider, model, category, inputJson }) {
  return getDb().prepare(`
    INSERT INTO tasks (id, user_id, provider, model, category, state, input_json)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(id, userId, provider, model, category, JSON.stringify(inputJson));
}

function updateTask(id, fields) {
  const database = getDb();
  const keys = Object.keys(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ') + ', updated_at = datetime(\'now\')';
  return database.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`)
    .run(...Object.values(fields), id);
}

function getTask(id) {
  return getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function getUserTasks(userId, limit = 50) {
  return getDb().prepare(`
    SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
  `).all(userId, limit);
}

// ─── API Key Operations ──────────────────────────────────────────────────────
function addApiKey({ id, userId, provider, apiKeyEncrypted, label }) {
  return getDb().prepare(`
    INSERT INTO api_keys (id, user_id, provider, api_key_encrypted, label)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, userId, provider, apiKeyEncrypted, label);
}

function getUserApiKeys(userId) {
  return getDb().prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY added_at DESC').all(userId);
}

function updateApiKeyStatus(id, status) {
  return getDb().prepare('UPDATE api_keys SET status = ?, last_checked = datetime(\'now\') WHERE id = ?')
    .run(status, id);
}

function deleteApiKey(id, userId) {
  return getDb().prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(id, userId);
}

function getAllApiKeys() {
  return getDb().prepare(`
    SELECT ak.*, u.email as user_email FROM api_keys ak
    JOIN users u ON ak.user_id = u.id
    ORDER BY ak.added_at DESC
  `).all();
}

// ─── Admin Settings ──────────────────────────────────────────────────────────
function getAdminSettings() {
  const rows = getDb().prepare('SELECT key, value FROM admin_settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  return settings;
}

function setAdminSetting(key, value) {
  return getDb().prepare(`
    INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value);
}

// ─── Referral Operations ─────────────────────────────────────────────────────
function getUserByReferralCode(code) {
  return getDb().prepare('SELECT * FROM users WHERE referral_code = ?').get(code);
}

function createReferral({ id, referrerId, referredId, code }) {
  return getDb().prepare(`
    INSERT INTO referrals (id, referrer_id, referred_id, code) VALUES (?, ?, ?, ?)
  `).run(id, referrerId, referredId, code);
}

// ─── Download Operations ─────────────────────────────────────────────────────
function createDownload({ id, userId, taskId, fileUrl, fileType, category }) {
  return getDb().prepare(`
    INSERT INTO downloads (id, user_id, task_id, file_url, file_type, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, userId, taskId, fileUrl, fileType, category);
}

function getUserDownloads(userId, limit = 100) {
  return getDb().prepare(`
    SELECT * FROM downloads WHERE user_id = ? ORDER BY downloaded_at DESC LIMIT ?
  `).all(userId, limit);
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function getStats() {
  const database = getDb();
  const totalUsers = database.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get();
  const activeUsers = database.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE role != 'admin' AND is_active = 1 
    AND (subscription_end > datetime('now') OR trial_ends_at > datetime('now'))
  `).get();
  const totalTasks = database.prepare("SELECT COUNT(*) as count FROM tasks").get();
  const totalDownloads = database.prepare("SELECT COUNT(*) as count FROM downloads").get();
  return {
    totalUsers: totalUsers.count,
    activeUsers: activeUsers.count,
    totalTasks: totalTasks.count,
    totalDownloads: totalDownloads.count
  };
}

module.exports = {
  getDb, initialize,
  createUser, getUserByEmail, getUserById, getAllUsers, updateUser, deleteUser, isUserActive,
  createTask, updateTask, getTask, getUserTasks,
  addApiKey, getUserApiKeys, updateApiKeyStatus, deleteApiKey, getAllApiKeys,
  getAdminSettings, setAdminSetting,
  getUserByReferralCode, createReferral,
  createDownload, getUserDownloads,
  getStats
};