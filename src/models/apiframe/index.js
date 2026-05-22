// Apiframe.ai provider - docs.apiframe.ai (stub)
const axios = require('../../utils/request');

async function createTask(params) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).apiframe?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.post('https://api.apiframe.ai/v1/tasks', params, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.task_id, state: response.data.state || 0 };
}

async function getTaskResult(taskId) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).apiframe?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.get(`https://api.apiframe.ai/v1/tasks/${taskId}`, {
    headers: { 'Authorization': `Bearer ${key}` },
  });
  return { state: response.data.state, resultUrls: response.data.result_urls || [] };
}

module.exports = { createTask, getTaskResult };