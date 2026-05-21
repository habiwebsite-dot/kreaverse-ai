/**
 * kreaverse-ai - Common endpoints (download-url, upload)
 */
const express = require('express');
const multer = require('multer');
const { uploadAny } = require('../utils/cloudinary');
const { getTask } = require('../models/_helpers');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

router.get('/download-url', (req, res) => {
  const { taskId, index = 0 } = req.query;
  if (!taskId) return res.status(400).json({ ok: false, error: 'taskId wajib' });
  const t = getTask(taskId);
  if (!t) return res.status(404).json({ ok: false, error: 'Task tidak ditemukan' });
  const urls = t?.resultJson?.resultUrls || [];
  const url = urls[Number(index)] || urls[0] || null;
  if (!url) return res.status(404).json({ ok: false, error: 'Belum ada hasil' });
  res.json({ ok: true, data: { url, kind: t.kind, model: t.model, provider: t.provider } });
});

// Upload file ke Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'file wajib' });
    const folder = `kreaverse-ai/${req.body.kind || 'misc'}`;
    const out = await uploadAny(req.file.buffer, {
      folder,
      resource_type: req.body.kind === 'audio' ? 'video' : 'auto',
      mime: req.file.mimetype,
    });
    res.json({ ok: true, data: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Upload multi-file (sampai 5 gambar)
router.post('/upload-multi', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ ok: false, error: 'files wajib' });
    const folder = `kreaverse-ai/${req.body.kind || 'image'}`;
    const out = await Promise.all(req.files.map((f) =>
      uploadAny(f.buffer, { folder, resource_type: 'auto', mime: f.mimetype })
    ));
    res.json({ ok: true, data: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
