const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'anthropic-claude', provider: 'apibox', kind: 'chat', label: 'Claude 3.5',
  baseURL: 'https://api.anthropic.com', envKey: 'ANTHROPIC_API_KEY', headerStyle: 'x-api-key',
  modelName: 'claude-3-5-sonnet-latest',
  paths: { create: '/v1/messages' },
  buildBody: (input, model) => ({
    model,
    max_tokens: input.maxTokens || 1024,
    messages: input.messages || [{ role: 'user', content: input.prompt || '' }],
  }),
  parseTaskId: (d) => 'ant_' + (d?.id || Date.now()),
  parseInfo: () => ({ state: 2 }),
});
