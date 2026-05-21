const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'grok-imagine', provider: 'grok', kind: 'image', label: 'Grok Imagine',
  baseURL: 'https://api.x.ai', envKey: 'GROK_API_KEY', headerStyle: 'xai',
  modelName: 'grok-2-image',
  paths: { create: '/v1/images/generations' },
  buildBody: (input, model) => ({
    model,
    prompt: input.prompt,
    n: input.n || 1,
    response_format: input.response_format || 'url',
  }),
  parseTaskId: (d) => 'grok_' + (d?.id || Date.now()),
  parseInfo: () => ({ state: 2 }),
});
