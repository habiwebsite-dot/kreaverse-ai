/**
 * kreaverse-ai - main entry
 * By: HABI-STUDIO.AI
 * Serverless-ready (Vercel/Cloudflare Pages) + Express server
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const config   = require('../config/default.json');
const jobs     = require('./endpoints/jobs');
const userRtr  = require('./endpoints/user');
const common   = require('./endpoints/common');
const { listProviders, listAll } = require('./models');
const { ensureOwner, verifyToken } = require('./middleware/auth');

ensureOwner();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Attach user from JWT if present (optional)
app.use((req, _res, next) => {
  const h = req.headers.authorization || '';
  const tk = h.startsWith('Bearer ') ? h.slice(7) : null;
  const p = tk && verifyToken(tk);
  if (p) req.user = p;
  next();
});
app.use(userRtr.attachUserKeys);

// Public info
app.get('/api/v1/info', (_req, res) => {
  res.json({
    ok: true,
    app: config.app,
    pricing: config.pricing,
    languages: config.languages,
    providers: config.providers,
    models: listAll(),
    modelsByProvider: listProviders(),
  });
});

// === Mounted routers ===
app.use('/api/v1/jobs',   jobs);
app.use('/api/v1/user',   userRtr);
app.use('/api/v1/common', common);

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[kreaverse-ai]', err);
  res.status(err.statusCode || 500).json({ ok: false, error: err.message });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 kreaverse-ai running on http://localhost:${PORT}`));
}

module.exports = app;
