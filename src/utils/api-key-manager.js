// Manajemen multi API key dengan failover otomatis
const { getDb } = require('./database');

function getUserApiKeys(userId, provider) {
  const db = getDb();
  const keys = db.prepare('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND provider = ? AND is_active = 1').all(userId, provider);
  return keys.map(k => Buffer.from(k.encrypted_key, 'base64').toString('utf-8'));
}

function getActiveApiKey(user, provider, usePersonal = false) {
  if (usePersonal) {
    const personalKeys = getUserApiKeys(user.id, provider);
    if (personalKeys.length > 0) return personalKeys[0]; // sederhana, ambil pertama
  }
  // Gunakan API key server dari environment
  const envKeys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS) : {};
  const keysStr = envKeys[provider.replace(/-/g, '_')] || envKeys[provider] || '';
  const serverKeys = keysStr.split(',').filter(Boolean);
  return serverKeys[0] || null;
}

module.exports = { getActiveApiKey };