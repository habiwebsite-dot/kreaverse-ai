const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, prompt } = params;
  const key = getApiKey('grok', apiKey);
  const response = await axios.post('https://api.x.ai/v1/chat/completions', { model: 'grok-2', messages: [{ role: 'user', content: prompt }] }, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  const text = response.data.choices?.[0]?.message?.content || '';
  return { taskId: 'grok-' + Date.now(), state: 2, result: { text } };
}
async function getTaskResult(taskId) { return { state: 2, result: {} }; }
module.exports = { createTask, getTaskResult };