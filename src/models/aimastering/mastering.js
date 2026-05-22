const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');

async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('aimastering', apiKey);
  const response = await axios.post('https://api.aimastering.com/v1/master', rest, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.job_id, state: 0 };
}

async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('aimastering', apiKeyParam);
  const response = await axios.get(`https://api.aimastering.com/v1/master/${taskId}`, {
    headers: { 'Authorization': `Bearer ${key}` },
  });
  return { state: response.data.status === 'completed' ? 2 : 1, resultUrls: [response.data.output_url] };
}

module.exports = { createTask, getTaskResult };