const axios = require('../../utils/request');
const { getApiKey } = require('../../utils/get-api-key');
async function createTask(params) {
  const { apiKey, ...rest } = params;
  const key = getApiKey('leonardo', apiKey);
  const response = await axios.post('https://cloud.leonardo.ai/api/rest/v1/generations', rest, { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } });
  return { taskId: response.data.sdGenerationJob.generationId, state: 0 };
}
async function getTaskResult(taskId, apiKeyParam) {
  const key = getApiKey('leonardo', apiKeyParam);
  const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${taskId}`, { headers: { 'Authorization': `Bearer ${key}` } });
  const images = response.data.generations_by_pk?.generated_images || [];
  return { state: response.data.generations_by_pk?.status === 'COMPLETE' ? 2 : 1, resultUrls: images.map(i => i.url) };
}
module.exports = { createTask, getTaskResult };