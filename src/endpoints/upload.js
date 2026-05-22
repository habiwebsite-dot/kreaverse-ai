const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../utils/cloudinary');
const auth = require('../middleware/auth');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
router.post('/file', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
  try {
    const result = await uploadFile(req.file.buffer, { resource_type: 'auto' });
    res.json({ success: true, data: { url: result.secure_url } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload gagal' });
  }
});
module.exports = router;