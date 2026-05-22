// Utility untuk mendapatkan API key berdasarkan provider dan override
function getApiKey(provider, overrideKey) {
  // Jika ada key override (dari user), pakai itu
  if (overrideKey) return overrideKey;

  // Baca dari environment variable PROVIDER_API_KEYS (JSON string)
  const envKeys = process.env.PROVIDER_API_KEYS 
    ? JSON.parse(process.env.PROVIDER_API_KEYS) 
    : {};

  // Normalisasi: provider 'kie-ai' menjadi 'kie_ai' (karena di JSON pakai underscore)
  const keyName = provider.replace(/-/g, '_');
  const keysStr = envKeys[keyName] || '';

  // Pisahkan beberapa key dengan koma, ambil yang pertama
  const keys = keysStr.split(',').filter(Boolean);
  return keys[0] || '';
}

module.exports = { getApiKey };
