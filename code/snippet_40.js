// Kie AI - Chat
const request = require('../../utils/request');

const BASE_URL = 'https://api.kie.ai';

module.exports = async function chat(input, apiKey) {
  const payload = {
    model: input.model || 'gpt-4o',
    messages: input.messages || [{ role: 'user', content: input.prompt || '' }],
    temperature: input.temperature || 0.7,
    max_tokens: input.maxTokens || 2048,
    stream: false
  };

  const res = await request.post(`${BASE_URL}/api/v1/chat/completions`, payload, {
    Authorization: `Bearer ${apiKey}`
  });

  if (!res.success) return { success: false, error: res.error };

  const content = res.data?.choices?.[0]?.message?.content || '';
  return {
    success: true,
    data: {
      content,
      model: res.data?.model,
      usage: res.data?.usage,
      resultUrls: []
    }
  };
};