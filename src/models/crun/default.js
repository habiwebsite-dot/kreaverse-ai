const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('crun', apiKey);
  const response = await axios.post('https://api.crun.ai/v1/generation', rest, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.id, state: response.data.status === 'done' ? 2 : 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('crun', apiKeyParam);
  const response = await axios.get(`https://api.crun.ai/v1/generation/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  return { state: response.data.status === 'done' ? 2 : 1, resultUrls: response.data.output || [] };
}
module.exports = { createTask, getTaskResult };