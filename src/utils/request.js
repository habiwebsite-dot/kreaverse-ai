/**
 * kreaverse-ai - axios wrapper
 * By: HABI-STUDIO.AI
 */
const axios = require('axios');

function buildClient(baseURL, apiKey, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'kreaverse-ai/1.0 (+habi-studio.ai)',
    ...extraHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  return axios.create({
    baseURL,
    headers,
    timeout: 60_000,
    validateStatus: (s) => s >= 200 && s < 500,
  });
}

async function safeRequest(client, method, url, payload) {
  try {
    const res = await client.request({ method, url, data: payload });
    return { ok: res.status < 400, status: res.status, data: res.data };
  } catch (err) {
    return {
      ok: false,
      status: err.response?.status || 500,
      data: { error: err.message, detail: err.response?.data || null },
    };
  }
}

module.exports = { buildClient, safeRequest };
