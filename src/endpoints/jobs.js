const express = require('express');
const router = express.Router();
const { getDb } = require('../utils/database');
const { getModel } = require('../models');
const { success, error } = require('../utils/response');
const { validateCreateTask } = require('../utils/validator');
const { getActiveApiKey } = require('../utils/api-key-manager');

router.post('/createTask', async (req, res) => {
  const { provider, model, input, usePersonalKey } = req.body;
  const validation = validateCreateTask({ provider, model, input });
  if (!validation.valid) return error(res, validation.message);
  const modelHandler = getModel(provider, model);
  if (!modelHandler) return error(res, 'Model tidak ditemukan', 404);
  const apiKey = getActiveApiKey(req.user, provider, usePersonalKey);
  if (!apiKey) return error(res, 'API key tidak tersedia', 400);
  try {
    const taskResult = await modelHandler.createTask({ ...input, apiKey });
    const db = getDb();
    const stmt = db.prepare('INSERT INTO tasks (user_id, external_task_id, provider, model, state) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(req.user.id, taskResult.taskId, provider, model, taskResult.state || 0);
    return success(res, { taskId: info.lastInsertRowid.toString(), state: taskResult.state || 0 });
  } catch (err) {
    console.error('Create task error:', err.message);
    return error(res, 'Gagal membuat task: ' + err.message, 500);
  }
});

router.get('/recordInfo', async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return error(res, 'taskId diperlukan');
  const db = getDb();
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, req.user.id);
  if (!task) return error(res, 'Task tidak ditemukan', 404);
  try {
    const modelHandler = getModel(task.provider, task.model);
    if (!modelHandler) return error(res, 'Model tidak tersedia', 404);
    const result = await modelHandler.getTaskResult(task.external_task_id);
    db.prepare('UPDATE tasks SET state = ?, result_json = ? WHERE id = ?').run(result.state, JSON.stringify(result.resultUrls || result.result || null), task.id);
    return success(res, { state: result.state, resultUrls: result.resultUrls || [], result: result.result || null });
  } catch (err) {
    console.error('Polling error:', err.message);
    return error(res, 'Gagal mengambil info task', 500);
  }
});

module.exports = router;