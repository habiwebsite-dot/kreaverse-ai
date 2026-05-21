const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'openai-gpt', provider: 'apibox', kind: 'chat', label: 'GPT-4o',
  baseURL: 'https://api.openai.com', envKey: 'OPENAI_API_KEY',
  modelName: 'gpt-4o-mini',
  paths: { create: '/v1/chat/completions' },
  buildBody: (input, model) => ({
    model,
    messages: input.messages || [{ role: 'user', content: input.prompt || '' }],
    temperature: input.temperature ?? 0.7,
  }),
  parseTaskId: (d) => 'oai_' + (d?.id || Date.now()),
  parseInfo: () => ({ state: 2 }),
});
