const express = require('express');
const router = express.Router();
router.get('/download-url', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: 'URL diperlukan' });
  try {
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Disposition', 'attachment');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mendownload' });
  }
});
module.exports = router;