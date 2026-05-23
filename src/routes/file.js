const express = require('express');
const router = express.Router();
const multer = require('multer');
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse, validateRequired } = require('../utils/helpers');

router.use(authMiddleware);

// Multer config for stream upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || 50) * 1024 * 1024
  }
});

/**
 * POST /api/file/upload/base64
 * Upload file via base64 encoding
 */
router.post('/upload/base64', async (req, res, next) => {
  try {
    const { file_data, file_name, file_type } = req.body;
    const missing = validateRequired(req.body, ['file_data', 'file_name']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    // Validate base64
    if (!file_data.includes('base64,') && !/^[A-Za-z0-9+/=]+$/.test(file_data)) {
      return errorResponse(res, 'Invalid base64 data', 400);
    }

    const result = await evolinkService.uploadBase64({
      file_data,
      file_name,
      ...(file_type && { file_type })
    });

    return successResponse(res, result, 200, {
      upload_method: 'base64',
      file_name
    });
  } catch (err) { next(err); }
});

/**
 * POST /api/file/upload/stream
 * Upload file via multipart/form-data stream
 */
router.post('/upload/stream', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file provided. Use multipart/form-data with field "file"', 400);
    }

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const result = await evolinkService.uploadStream(formData);

    return successResponse(res, result, 200, {
      upload_method: 'stream',
      original_name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (err) { next(err); }
});

/**
 * POST /api/file/upload/url
 * Upload file from URL
 */
router.post('/upload/url', async (req, res, next) => {
  try {
    const { url, file_name } = req.body;
    const missing = validateRequired(req.body, ['url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return errorResponse(res, 'Invalid URL format', 400);
    }

    const result = await evolinkService.uploadUrl({
      url,
      ...(file_name && { file_name })
    });

    return successResponse(res, result, 200, {
      upload_method: 'url',
      source_url: url
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/file/quota
 * Get file storage quota
 */
router.get('/quota', async (req, res, next) => {
  try {
    const result = await evolinkService.getFileQuota();
    return successResponse(res, result, 200);
  } catch (err) { next(err); }
});

module.exports = router;
