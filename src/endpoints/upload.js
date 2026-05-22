const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../utils/cloudinary');
const { success, error } = require('../utils/response');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/file', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return error(res, 'File tidak ditemukan');
    const result = await uploadFile(req.file.buffer, { resource_type: 'auto' });
    return success(res, { url: result.secure_url });
  } catch (err) {
    return error(res, 'Upload gagal', 500);
  }
});

module.exports = router;