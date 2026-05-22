```javascript
// API Box provider - docs.api.box (stub)
const axios = require('../../utils/request');

async function createTask(params) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).api_box?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.post('https://api.box.com/v1/generate', params, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.id, state: response.data.state || 0 };
}

async function getTaskResult(taskId) {
  const keys = process.env.PROVIDER_API_KEYS ? JSON.parse(process.env.PROVIDER_API_KEYS).api_box?.split(',') || [] : [];
  const key = keys[0] || '';
  const response = await axios.get(`https://api.box.com/v1/jobs/${taskId}`, {
    headers: { 'Authorization': `Bearer ${key}` },
  });
  return { state: response.data.state, resultUrls: response.data.resultUrls || [] };
}

module.exports = { createTask, getTaskResult };