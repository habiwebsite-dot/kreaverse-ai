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
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1/jobs', authMiddleware, jobsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/common', commonRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/upload', uploadRouter);
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

initDatabase().then(() => {
  console.log('Database siap.');
  cron.schedule('*/14 * * * *', () => {
    const http = require('http');
    http.get(`http://localhost:${PORT}/health`);
  });
  app.listen(PORT, () => console.log(`Kreaverse AI running on port ${PORT}`));
}).catch(err => {
  console.error('Gagal inisialisasi database:', err);
  process.exit(1);
});