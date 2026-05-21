const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'deepseek-chat', provider: 'deepseek', kind: 'chat', label: 'DeepSeek V3',
  baseURL: 'https://api.deepseek.com', envKey: 'DEEPSEEK_API_KEY',
  modelName: 'deepseek-chat',
  paths: { create: '/chat/completions' },
  buildBody: (input, model) => ({
    model,
    messages: input.messages || [{ role: 'user', content: input.prompt || '' }],
    temperature: input.temperature ?? 0.7,
  }),
  parseTaskId: (d) => 'ds_' + (d?.id || Date.now()),
  parseInfo: () => ({ state: 2 }),
});
