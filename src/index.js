require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { initDatabase } = require('./utils/database');
const authMiddleware = require('./middleware/auth');
const jobsRouter = require('./endpoints/jobs');
const userRouter = require('./endpoints/user');
const commonRouter = require('./endpoints/common');
const adminRouter = require('./endpoints/admin');
const uploadRouter = require('./endpoints/upload');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/v1/jobs', authMiddleware, jobsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/common', commonRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Init DB (async dengan sql.js), lalu jalankan server
initDatabase()
  .then(() => {
    console.log('Database siap.');

    // Anti-sleep cron every 14 minutes
    cron.schedule('*/14 * * * *', () => {
      const http = require('http');
      http.get(`http://localhost:${PORT}/health`, (res) => {
        console.log('Anti-sleep ping');
      });
    });

    app.listen(PORT, () => {
      console.log(`Kreaverse AI running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal inisialisasi database:', err);
    process.exit(1);
  });
