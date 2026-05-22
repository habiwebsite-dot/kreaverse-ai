const express = require('express');
const router = express.Router();
const { success, error } = require('../utils/response');

// GET /api/v1/common/download-url?url=...
router.get('/download-url', async (req, res) => {
  const { url } = req.query;
  if (!url) return error(res, 'URL diperlukan');
  try {
    // Proxy download (untuk keperluan CORS)
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Disposition', 'attachment');
    response.data.pipe(res);
  } catch (err) {
    return error(res, 'Gagal mendownload file', 500);
  }
});

module.exports = router;