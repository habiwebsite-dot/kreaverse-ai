// Crun.ai provider - docs.crun.ai (stub)
const axios = require('../../utils/request');

async function createTask(params) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).crun?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.post('https://api.crun.ai/v1/generation', params, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.id, state: response.data.status === 'done' ? 2 : 0 };
}

async function getTaskResult(taskId) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).crun?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.get(`https://api.crun.ai/v1/generation/${taskId}`, {
    headers: { 'Authorization': `Bearer ${key}` },
  });
  return { state: response.data.status === 'done' ? 2 : 1, resultUrls: response.data.output || [] };
}

module.exports = { createTask, getTaskResult };