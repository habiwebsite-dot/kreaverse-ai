const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('evolink', apiKey);
  const response = await axios.post('https://api.evolink.ai/v1/completions', rest, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.id, state: response.data.state || 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('evolink', apiKeyParam);
  const response = await axios.get(`https://api.evolink.ai/v1/completions/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  return { state: response.data.state, resultUrls: response.data.outputs || [] };
}
module.exports = { createTask, getTaskResult };