require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const cron = require('node-cron');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const db = require('./database/db');
const authMiddleware = require('./middleware/auth');
const jobsRouter = require('./endpoints/jobs');
const userRouter = require('./endpoints/user');
const commonRouter = require('./endpoints/common');
const adminRouter = require('./endpoints/admin');
const authRouter = require('./endpoints/auth');
const referralRouter = require('./endpoints/referral');
const paymentRouter = require('./endpoints/payment');
const config = require('../config/default.json');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security & Middleware ───────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: process.env.SELF_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'kreaverse-secret-fallback-dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: config.server.rateLimitWindowMs,
  max: config.server.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi nanti.' }
});
app.use('/api/', apiLimiter);

// ─── Static Files ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware.verifyToken, jobsRouter);
app.use('/api/v1/user', authMiddleware.verifyToken, userRouter);
app.use('/api/v1/common', authMiddleware.verifyToken, commonRouter);
app.use('/api/admin', authMiddleware.verifyAdmin, adminRouter);
app.use('/api/referral', authMiddleware.verifyToken, referralRouter);
app.use('/api/payment', paymentRouter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Kreaverse AI',
    version: '1.0.0'
  });
});

// ─── Public Config (no auth) ────────────────────────────────────────────────
app.get('/api/public/config', (req, res) => {
  const adminSettings = db.getAdminSettings();
  res.json({
    success: true,
    data: {
      siteName: 'Kreaverse AI',
      logo: adminSettings.logo || '/images/logo.png',
      paymentQr: adminSettings.paymentQr || '/images/payment-qr.png',
      subscriptionPrice: adminSettings.subscriptionPrice || config.subscription.price,
      whatsappNumber: config.subscription.whatsappNumber,
      providers: config.providers,
      promoBanner: adminSettings.promoBanner || null,
      promoPopup: adminSettings.promoPopup || null
    }
  });
});

// ─── SPA Fallback ────────────────────────────────────────────────────────────
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── Anti-Sleep Triple Protection (Render free tier) ────────────────────────
const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;

// Protection 1: Cron every 14 minutes
cron.schedule('*/14 * * * *', async () => {
  try {
    await fetch(`${SELF_URL}/api/health`);
    console.log(`[AntiSleep] Ping 1 OK - ${new Date().toISOString()}`);
  } catch (e) {
    console.error('[AntiSleep] Ping 1 failed:', e.message);
  }
});

// Protection 2: Cron every 10 minutes (offset)
cron.schedule('*/10 * * * *', async () => {
  try {
    await fetch(`${SELF_URL}/api/health`);
    console.log(`[AntiSleep] Ping 2 OK - ${new Date().toISOString()}`);
  } catch (e) {
    console.error('[AntiSleep] Ping 2 failed:', e.message);
  }
});

// Protection 3: setInterval every 13 minutes
setInterval(async () => {
  try {
    await fetch(`${SELF_URL}/api/health`);
    console.log(`[AntiSleep] Ping 3 OK - ${new Date().toISOString()}`);
  } catch (e) {
    console.error('[AntiSleep] Ping 3 failed:', e.message);
  }
}, 13 * 60 * 1000);

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Kreaverse AI Server running on port ${PORT}`);
  console.log(`📡 Health: ${SELF_URL}/api/health`);
  console.log(`🌐 Frontend: ${SELF_URL}`);
  console.log(`🔒 Admin: ${SELF_URL}/admin\n`);
  db.initialize();
});

module.exports = app;