const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');

async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('deepseek', apiKey);
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', rest, {
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  return { taskId: response.data.id, state: 2, result: response.data };
}

async function getTaskResult(taskId) {
  return { state: 2, result: {} };
}

module.exports = { createTask, getTaskResult };