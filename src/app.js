require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Routes
const audioRoutes = require('./routes/audio');
const imageRoutes = require('./routes/image');
const videoRoutes = require('./routes/video');
const accountRoutes = require('./routes/account');
const taskRoutes = require('./routes/task');
const fileRoutes = require('./routes/file');
const auphonicRoutes = require('./routes/auphonic');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// ─── General Middleware ───────────────────────────────────────────────────────
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(rateLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      evolink: !!process.env.EVOLINK_API_KEY,
      auphonic: !!process.env.AUPHONIC_API_KEY
    }
  });
});

// ─── API Info ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'EvoLink AI + Auphonic API Gateway',
    version: '1.0.0',
    endpoints: {
      audio: {
        base: '/api/audio',
        routes: [
          'POST /api/audio/suno/generate',
          'POST /api/audio/suno/persona',
          'POST /api/audio/qwen/voice-design',
          'POST /api/audio/qwen/tts-vd'
        ]
      },
      image: {
        base: '/api/image',
        routes: [
          'POST /api/image/nanobanana2/generate',
          'POST /api/image/nanobanana-pro/generate',
          'POST /api/image/nanobanana/generate',
          'POST /api/image/midjourney/v7/generate',
          'POST /api/image/gpt4o/generate',
          'POST /api/image/gpt-image-2/generate',
          'POST /api/image/seedream/generate',
          'POST /api/image/wan25/image-to-image',
          'POST /api/image/wan25/text-to-image'
        ]
      },
      video: {
        base: '/api/video',
        routes: [
          'POST /api/video/seedance20/text-to-video',
          'POST /api/video/seedance20/image-to-video',
          'POST /api/video/seedance20/reference-to-video',
          'POST /api/video/happyhorse/text-to-video',
          'POST /api/video/happyhorse/image-to-video',
          'POST /api/video/happyhorse/reference-to-video',
          'POST /api/video/sora2/generate',
          'POST /api/video/sora2pro/generate',
          'POST /api/video/veo31/generate',
          'POST /api/video/veo31/fast',
          'POST /api/video/veo31/pro',
          'POST /api/video/wan27/text-to-video',
          'POST /api/video/wan27/image-to-video',
          'POST /api/video/wan27/reference',
          'POST /api/video/kling/o3/text-to-video',
          'POST /api/video/kling/o3/image-to-video',
          'POST /api/video/kling/o3/reference',
          'POST /api/video/kling/v3/image-to-video',
          'POST /api/video/kling/v3/motion-control',
          'POST /api/video/kling/o1/image-to-video',
          'POST /api/video/grok/text-to-video',
          'POST /api/video/grok/image-to-video'
        ]
      },
      account: {
        routes: ['GET /api/account/credits']
      },
      task: {
        routes: [
          'GET /api/task/:taskId',
          'GET /api/task/errors/list'
        ]
      },
      file: {
        routes: [
          'POST /api/file/upload/base64',
          'POST /api/file/upload/stream',
          'POST /api/file/upload/url',
          'GET /api/file/quota'
        ]
      },
      auphonic: {
        routes: [
          'POST /api/auphonic/production/simple',
          'POST /api/auphonic/production/start',
          'POST /api/auphonic/production/:uuid/start',
          'GET /api/auphonic/production/:uuid',
          'DELETE /api/auphonic/production/:uuid',
          'GET /api/auphonic/productions',
          'POST /api/auphonic/preset/create',
          'GET /api/auphonic/presets',
          'GET /api/auphonic/info'
        ]
      }
    }
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/audio', audioRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/auphonic', auphonicRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔑 EvoLink API: ${process.env.EVOLINK_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  logger.info(`🎵 Auphonic API: ${process.env.AUPHONIC_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;
