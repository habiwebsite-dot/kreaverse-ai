const request = require('../../utils/request');

const BASE_URL = 'https://api.kie.ai';

async function createTask(endpoint, payload, apiKey) {
  return request.post(`${BASE_URL}${endpoint}`, payload, {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  });
}

async function getTaskResult(taskId, apiKey) {
  return request.get(`${BASE_URL}/api/v1/task/${taskId}`, {}, {
    Authorization: `Bearer ${apiKey}`
  });
}

async function pollTask(taskId, apiKey, maxAttempts = 60) {
  return request.pollUntilDone(async () => {
    const r = await getTaskResult(taskId, apiKey);
    if (!r.success) return { done: false, failed: true, error: r.error };
    const data = r.data?.data || r.data;
    const status = data?.status || data?.state;
    if (status === 'SUCCESS' || status === 2 || status === 'success') {
      const urls = extractUrls(data);
      return { done: true, data: { ...data, resultUrls: urls } };
    }
    if (status === 'FAILED' || status === 3 || status === 'failed') {
      return { done: false, failed: true, error: data?.errorMsg || 'Task gagal' };
    }
    return { done: false };
  });
}

function extractUrls(data) {
  const candidates = [
    data?.resultUrl, data?.videoUrl, data?.audioUrl, data?.imageUrl,
    ...(data?.resultUrls || []), ...(data?.urls || [])
  ].filter(Boolean);
  return [...new Set(candidates)];
}

module.exports = { BASE_URL, createTask, getTaskResult, pollTask };