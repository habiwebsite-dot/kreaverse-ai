const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('sqlite:///', '') 
  : path.join(__dirname, '..', '..', 'data', 'kreaverse.db');

let db;

function initDatabase() {
  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      subscription_end TEXT,
      unlimited INTEGER DEFAULT 0,
      credits INTEGER DEFAULT 0,
      referral_code TEXT UNIQUE,
      referred_by TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      encrypted_key TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      external_task_id TEXT,
      provider TEXT,
      model TEXT,
      state INTEGER DEFAULT 0,
      result_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id INTEGER NOT NULL,
      referred_email TEXT,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(referrer_id) REFERENCES users(id)
    );
  `);

  // Insert admin user if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'habistudio.ai@unlimited.com';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('habi.studio.com', 10);
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (email, password_hash, role, unlimited, credits) VALUES (?, ?, ?, ?, ?)')
      .run(adminEmail, adminPasswordHash, 'admin', 1, 999999);
    console.log('Admin user created');
  }
  
  return db;
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb };