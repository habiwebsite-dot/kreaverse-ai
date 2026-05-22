const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('apiframe', apiKey);
  const response = await axios.post('https://api.apiframe.ai/v1/tasks', rest, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.task_id, state: response.data.state || 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('apiframe', apiKeyParam);
  const response = await axios.get(`https://api.apiframe.ai/v1/tasks/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  return { state: response.data.state, resultUrls: response.data.result_urls || [] };
}
module.exports = { createTask, getTaskResult };