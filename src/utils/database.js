const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('sqlite:///', '') : path.join(__dirname, '..', '..', 'data', 'kreaverse.db');
let db;

async function initDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const SQL = await initSqlJs();
  db = fs.existsSync(DB_PATH) ? new SQL.Database(fs.readFileSync(DB_PATH)) : new SQL.Database();
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'user', subscription_end TEXT, unlimited INTEGER DEFAULT 0, credits INTEGER DEFAULT 0, referral_code TEXT UNIQUE, referred_by TEXT, created_at TEXT DEFAULT (datetime('now')))");
  db.run("CREATE TABLE IF NOT EXISTS api_keys (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, provider TEXT NOT NULL, encrypted_key TEXT NOT NULL, is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(user_id) REFERENCES users(id))");
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, external_task_id TEXT, provider TEXT, model TEXT, state INTEGER DEFAULT 0, result_json TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(user_id) REFERENCES users(id))");
  db.run("CREATE TABLE IF NOT EXISTS referrals (id INTEGER PRIMARY KEY AUTOINCREMENT, referrer_id INTEGER NOT NULL, referred_email TEXT, used INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(referrer_id) REFERENCES users(id))");
  const adminEmail = process.env.ADMIN_EMAIL || 'habistudio.ai@unlimited.com';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('habi.studio.com', 10);
  const adminExists = getDb().prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!adminExists) {
    getDb().prepare('INSERT INTO users (email, password_hash, role, unlimited, credits) VALUES (?, ?, ?, ?, ?)').run(adminEmail, adminPasswordHash, 'admin', 1, 999999);
  }
  saveDatabase();
  return db;
}

function saveDatabase() {
  if (db) fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

function getDb() {
  return {
    prepare: (sql) => ({
      run: (...params) => { db.run(sql, params); saveDatabase(); const lastId = db.exec('SELECT last_insert_rowid()'); return { lastInsertRowid: lastId[0]?.values[0]?.[0] }; },
      get: (...params) => { const stmt = db.prepare(sql); stmt.bind(params); if (stmt.step()) { const cols = stmt.getColumnNames(); const vals = stmt.get(); const row = {}; cols.forEach((c, i) => row[c] = vals[i]); stmt.free(); return row; } stmt.free(); return undefined; },
      all: (...params) => { const stmt = db.prepare(sql); stmt.bind(params); const rows = []; const cols = stmt.getColumnNames(); while (stmt.step()) { const vals = stmt.get(); const row = {}; cols.forEach((c, i) => row[c] = vals[i]); rows.push(row); } stmt.free(); return rows; }
    }),
    exec: (sql) => db.exec(sql),
    run: (sql, params) => { db.run(sql, params); saveDatabase(); }
  };
}

process.on('exit', () => saveDatabase());
process.on('SIGINT', () => { saveDatabase(); process.exit(); });
module.exports = { initDatabase, getDb };