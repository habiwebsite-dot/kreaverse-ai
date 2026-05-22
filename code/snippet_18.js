const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const db = require('../database/db');
const { success, error } = require('../utils/response');
const { validateCreateTask, sanitizeObject } = require('../utils/validator');
const { uploadBuffer } = require('../utils/cloudinary');
const { decrypt } = require('../utils/encryption');
const modelIndex = require('../models/index');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// POST /api/v1/jobs/createTask
router.post('/createTask', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'files', maxCount: 5 },
  { name: 'audio', maxCount: 1 },
  { name: 'reference', maxCount: 1 },
  { name: 'referenceAudio', maxCount: 1 }
]), async (req, res) => {
  const bodyData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
  const errs = validateCreateTask(bodyData);
  if (errs.length) return error(res, errs.join(', '), 400);

  const { provider, model, input, callBackUrl, useOwnKey } = bodyData;
  const sanitizedInput = sanitizeObject(input);

  // Handle file uploads
  if (req.files) {
    for (const [fieldName, files] of Object.entries(req.files)) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const uploadResult = await uploadBuffer(f.buffer, f.mimetype, f.originalname, 
          fieldName === 'files' ? 'references' : fieldName);
        if (!uploadResult.success) return error(res, `Upload gagal: ${uploadResult.error}`, 500);
        if (fieldName === 'files') {
          sanitizedInput[`photo${i + 1}`] = uploadResult.url;
          sanitizedInput[`referenceImage${i + 1}`] = uploadResult.url;
        } else {
          sanitizedInput[`${fieldName}Url`] = uploadResult.url;
        }
      }
    }
  }

  // Resolve API key
  let apiKey = null;
  if (useOwnKey) {
    apiKey = await getBestUserApiKey(req.user.id, provider);
    if (!apiKey) return error(res, 'Tidak ada API key aktif untuk provider ini. Tambahkan API key di pengaturan.', 400);
  } else {
    apiKey = getAdminApiKey(provider);
    if (!apiKey) return error(res, 'Server API key belum dikonfigurasi untuk provider ini.', 503);
  }

  const taskId = uuidv4();
  db.createTask({
    id: taskId,
    userId: req.user.id,
    provider,
    model,
    category: detectCategory(provider, model),
    inputJson: sanitizedInput
  });

  // Execute model handler
  const handler = modelIndex.getHandler(provider, model);
  if (!handler) {
    db.updateTask(taskId, { state: 3, error_message: 'Model tidak ditemukan' });
    return error(res, `Model "${model}" dari provider "${provider}" tidak ditemukan`, 404);
  }

  // Start async execution
  executeTask(taskId, handler, sanitizedInput, apiKey, callBackUrl);

  return success(res, { taskId, state: 0, message: 'Task sedang diproses...' }, 'Task berhasil dibuat', 201);
});

async function executeTask(taskId, handler, input, apiKey, callBackUrl) {
  try {
    db.updateTask(taskId, { state: 1 });
    const result = await handler(input, apiKey);
    
    if (result.success) {
      db.updateTask(taskId, {
        state: 2,
        task_id: result.taskId || taskId,
        result_json: JSON.stringify(result.data)
      });
    } else {
      db.updateTask(taskId, { state: 3, error_message: result.error });
    }

    if (callBackUrl) {
      const fetch = require('node-fetch');
      await fetch(callBackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, state: result.success ? 2 : 3, result: result.data })
      }).catch(() => {});
    }
  } catch (err) {
    db.updateTask(taskId, { state: 3, error_message: err.message });
  }
}

// GET /api/v1/jobs/recordInfo
router.get('/recordInfo', (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return error(res, 'taskId wajib diisi', 400);
  
  const task = db.getTask(taskId);
  if (!task) return error(res, 'Task tidak ditemukan', 404);
  if (task.user_id !== req.user.id && req.user.role !== 'admin') {
    return error(res, 'Akses ditolak', 403);
  }

  let resultJson = null;
  try { resultJson = task.result_json ? JSON.parse(task.result_json) : null; } catch {}

  return success(res, {
    taskId: task.id,
    provider: task.provider,
    model: task.model,
    category: task.category,
    state: task.state,
    stateText: ['pending', 'processing', 'success', 'failed'][task.state] || 'unknown',
    resultJson,
    errorMessage: task.error_message,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  });
});

// GET /api/v1/jobs/list
router.get('/list', (req, res) => {
  const tasks = db.getUserTasks(req.user.id, 50);
  return success(res, tasks.map(t => ({
    taskId: t.id,
    provider: t.provider,
    model: t.model,
    category: t.category,
    state: t.state,
    stateText: ['pending', 'processing', 'success', 'failed'][t.state] || 'unknown',
    createdAt: t.created_at,
    updatedAt: t.updated_at
  })));
});

// Helper: get best user API key (with failover)
async function getBestUserApiKey(userId, provider) {
  const keys = db.getUserApiKeys(userId).filter(k => k.provider === provider);
  for (const k of keys) {
    const plain = decrypt(k.api_key_encrypted);
    if (plain) return plain;
  }
  return null;
}

// Helper: get admin API key (with failover)
function getAdminApiKey(provider) {
  try {
    const keysJson = process.env.PROVIDER_API_KEYS;
    if (!keysJson) return null;
    const keys = JSON.parse(keysJson);
    const providerKeys = keys[provider];
    if (!providerKeys || !providerKeys.length) return null;
    // Return first available key (could be enhanced with health check)
    return providerKeys[0];
  } catch {
    return null;
  }
}

function detectCategory(provider, model) {
  const audioModels = ['suno', 'music', 'audio', 'mastering', 'cover'];
  const videoModels = ['video', 'wan', 'runway', 'kling', 'luma'];
  const chatModels = ['deepseek', 'gemini', 'grok', 'chat', 'gpt'];
  const m = model.toLowerCase();
  if (audioModels.some(k => m.includes(k))) return 'audio';
  if (videoModels.some(k => m.includes(k))) return 'video';
  if (chatModels.some(k => m.includes(k))) return 'chat';
  return 'image';
}

module.exports = router;