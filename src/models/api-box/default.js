const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('api-box', apiKey);
  const response = await axios.post('https://api.box.com/v1/generate', rest, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.id, state: response.data.state || 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('api-box', apiKeyParam);
  const response = await axios.get(`https://api.box.com/v1/jobs/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  return { state: response.data.state, resultUrls: response.data.resultUrls || [] };
}
module.exports = { createTask, getTaskResult };