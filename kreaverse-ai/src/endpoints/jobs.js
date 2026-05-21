/**
 * kreaverse-ai - Unified Jobs endpoints
 *   POST /api/v1/jobs/createTask
 *   GET  /api/v1/jobs/recordInfo?taskId=...
 */
const express = require('express');
const { getModel } = require('../models');
const { required } = require('../utils/validator');

const router = express.Router();

router.post('/createTask', async (req, res) => {
  try {
    const { model, input = {}, callBackUrl } = req.body || {};
    required(req.body || {}, ['model']);
    const adapter = getModel(model);
    if (!adapter) return res.status(404).json({ ok: false, error: `Model "${model}" tidak ditemukan` });

    const ctx = { userKeys: req.userKeys || {}, user: req.user || null };
    const out = await adapter.createTask({ ...input, callBackUrl }, ctx);
    res.json({ ok: true, code: 200, data: out });
  } catch (e) {
    res.status(e.statusCode || 500).json({ ok: false, error: e.message });
  }
});

router.get('/recordInfo', async (req, res) => {
  try {
    const taskId = req.query.taskId;
    if (!taskId) return res.status(400).json({ ok: false, error: 'taskId wajib' });
    // tebak model dari prefix taskId tidak realible — minta query model opsional
    const modelId = req.query.model;
    let adapter = modelId ? getModel(modelId) : null;
    if (!adapter) {
      // fallback: cari pada in-memory store
      const { getTask } = require('../models/_helpers');
      const t = getTask(taskId);
      if (t) adapter = getModel(`${t.provider}-${t.model}`) || null;
    }
    if (!adapter) {
      const { getTask } = require('../models/_helpers');
      const t = getTask(taskId);
      if (!t) return res.status(404).json({ ok: false, error: 'Task tidak ditemukan' });
      return res.json({ ok: true, data: t });
    }
    const ctx = { userKeys: req.userKeys || {}, user: req.user || null };
    const info = await adapter.recordInfo(taskId, ctx);
    res.json({ ok: true, data: info });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
