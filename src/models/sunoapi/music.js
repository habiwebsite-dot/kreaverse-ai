const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');

async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('sunoapi', apiKey);
  const response = await axios.post('https://api.sunoapi.org/v1/generate', rest, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.task_id, state: 0 };
}

async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('sunoapi', apiKeyParam);
  const response = await axios.get(`https://api.sunoapi.org/v1/tasks/${taskId}`, {
    headers: { 'Authorization': `Bearer ${key}` },
  });
  const urls = response.data.audio_urls || [];
  return { state: response.data.state === 'completed' ? 2 : 1, resultUrls: urls };
}

module.exports = { createTask, getTaskResult };