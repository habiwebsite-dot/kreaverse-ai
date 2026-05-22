const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('kie-ai', apiKey);
  const response = await axios.post('https://api.kie.ai/v1/images/generations', { ...rest, model: 'flux' }, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.id, state: response.data.state || 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('kie-ai', apiKeyParam);
  const response = await axios.get(`https://api.kie.ai/v1/jobs/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  return { state: response.data.state, resultUrls: response.data.resultUrls || [] };
}
module.exports = { createTask, getTaskResult };