const validateCreateTask = (body) => {
  const errors = [];
  if (!body.provider) errors.push('provider wajib diisi');
  if (!body.model) errors.push('model wajib diisi');
  if (!body.input) errors.push('input wajib diisi');
  if (typeof body.input !== 'object') errors.push('input harus berupa object');
  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  if (!body.email) errors.push('email wajib diisi');
  if (!body.password) errors.push('password wajib diisi');
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push('format email tidak valid');
  return errors;
};

const validateCreateUser = (body) => {
  const errors = [];
  if (!body.email) errors.push('email wajib diisi');
  if (!body.password) errors.push('password wajib diisi');
  if (!body.name) errors.push('nama wajib diisi');
  if (!body.subscriptionEnd) errors.push('subscriptionEnd wajib diisi');
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push('format email tidak valid');
  if (body.password && body.password.length < 6) errors.push('password minimal 6 karakter');
  return errors;
};

const validateApiKey = (body) => {
  const errors = [];
  if (!body.provider) errors.push('provider wajib diisi');
  if (!body.apiKey) errors.push('apiKey wajib diisi');
  return errors;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/[<>]/g, '');
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = typeof v === 'string' ? sanitizeString(v) : 
               typeof v === 'object' ? sanitizeObject(v) : v;
  }
  return clean;
};

module.exports = { validateCreateTask, validateLogin, validateCreateUser, validateApiKey, sanitizeString, sanitizeObject };