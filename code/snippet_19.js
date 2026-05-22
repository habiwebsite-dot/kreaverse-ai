const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const { success, error } = require('../utils/response');

// GET /api/v1/common/download-url
router.get('/download-url', async (req, res) => {
  const { taskId, url } = req.query;
  
  if (url) {
    // Direct URL download proxy
    try {
      const response = await axios.get(url, { 
        responseType: 'stream',
        timeout: 60000,
        headers: { 'User-Agent': 'KreaverseAI/1.0' }
      });
      
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const ext = getExtFromContentType(contentType);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="kreaverse-ai-${Date.now()}${ext}"`);
      res.setHeader('X-Powered-By', 'Kreaverse AI');
      response.data.pipe(res);
    } catch (err) {
      return error(res, 'Gagal mengunduh file: ' + err.message, 500);
    }
    return;
  }

  if (taskId) {
    const task = db.getTask(taskId);
    if (!task) return error(res, 'Task tidak ditemukan', 404);
    if (task.user_id !== req.user.id && req.user.role !== 'admin') return error(res, 'Akses ditolak', 403);
    if (task.state !== 2) return error(res, 'Task belum selesai', 400);

    let resultJson = null;
    try { resultJson = JSON.parse(task.result_json); } catch {}
    
    const urls = resultJson?.resultUrls || resultJson?.urls || [];
    
    // Log download
    urls.forEach(fileUrl => {
      db.createDownload({
        id: uuidv4(),
        userId: req.user.id,
        taskId: task.id,
        fileUrl,
        fileType: detectFileType(fileUrl),
        category: task.category
      });
    });

    return success(res, { urls, task: { id: task.id, category: task.category, model: task.model } });
  }

  return error(res, 'taskId atau url wajib diisi', 400);
});

// POST /api/v1/common/upload
router.post('/upload', require('multer')({ 
  storage: require('multer').memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
}).single('file'), async (req, res) => {
  if (!req.file) return error(res, 'File tidak ditemukan', 400);
  const { uploadBuffer } = require('../utils/cloudinary');
  const result = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, 'user-uploads');
  if (!result.success) return error(res, result.error, 500);
  return success(res, { url: result.url, publicId: result.publicId }, 'Upload berhasil');
});

// GET /api/v1/common/models
router.get('/models', (req, res) => {
  const models = require('../models/index').getAllModels();
  return success(res, models);
});

function getExtFromContentType(ct) {
  if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('mp4')) return '.mp4';
  if (ct.includes('mp3')) return '.mp3';
  if (ct.includes('wav')) return '.wav';
  if (ct.includes('gif')) return '.gif';
  return '';
}

function detectFileType(url) {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|webp|gif)/.test(lower)) return 'image';
  if (/\.(mp4|webm|mov)/.test(lower)) return 'video';
  if (/\.(mp3|wav|flac|ogg)/.test(lower)) return 'audio';
  return 'file';
}

module.exports = router;