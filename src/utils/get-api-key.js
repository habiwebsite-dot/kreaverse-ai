```javascript
// Utility untuk mendapatkan API key berdasarkan provider dan override
function getApiKey(provider, overrideKey) {
  if (overrideKey) return overrideKey;
  const envKeys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS) : {};
  // Normalisasi: provider 'kie-ai' menjadi 'kie_ai' di environment
  const keyName = provider.replace(/-/g, '_');
  const keysStr = envKeys[keyName] || '';
  const keys = keysStr.split(',').filter(Boolean);
  return keys[0] || '';
}

module.exports = { getApiKey };