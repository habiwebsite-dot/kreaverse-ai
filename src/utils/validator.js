/**
 * kreaverse-ai - validator
 */
function required(obj, fields) {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (missing.length) {
    const err = new Error(`Field wajib hilang: ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
}

function clamp(n, min, max) {
  n = Number(n);
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function isUrl(s) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

module.exports = { required, clamp, isUrl };
