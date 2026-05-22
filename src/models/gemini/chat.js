const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, prompt } = params;
  const key = getApiKey('gemini', apiKey);
  const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, { contents: [{ parts: [{ text: prompt }] }] });
  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { taskId: 'gemini-' + Date.now(), state: 2, result: { text } };
}
async function getTaskResult(taskId) { return { state: 2, result: {} }; }
module.exports = { createTask, getTaskResult };