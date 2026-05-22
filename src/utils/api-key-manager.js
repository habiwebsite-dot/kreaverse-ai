// Manajemen multi API key dengan failover otomatis
const { getDb } = require('./database');

// Ambil semua API key pribadi user untuk provider tertentu
function getUserApiKeys(userId, provider) {
  const db = getDb();
  const keys = db.prepare('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND provider = ? AND is_active = 1').all(userId, provider);
  // Decrypt (base64) dan kembalikan array key
  return keys.map(k => Buffer.from(k.encrypted_key, 'base64').toString('utf-8'));
}

// Pilih API key yang akan digunakan (personal atau server)
function getActiveApiKey(user, provider, usePersonal = false) {
  if (usePersonal) {
    const personalKeys = getUserApiKeys(user.id, provider);
    if (personalKeys.length > 0) return personalKeys[0]; // ambil pertama yang aktif
  }
  // Gunakan API key dari environment (server)
  const envKeys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS) : {};
  const keyName = provider.replace(/-/g, '_');
  const keysStr = envKeys[keyName] || envKeys[provider] || '';
  const serverKeys = keysStr.split(',').filter(Boolean);
  return serverKeys[0] || null;
}

module.exports = { getActiveApiKey };
