const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'grok-video', provider: 'grok', kind: 'video', label: 'Grok Video',
  baseURL: 'https://api.x.ai', envKey: 'GROK_API_KEY', headerStyle: 'xai',
  modelName: 'grok-2-video',
  paths: { create: '/v1/videos/generations' },
  buildBody: (input, model) => ({
    model,
    prompt: input.prompt,
    duration: input.duration || 5,
    aspect_ratio: input.aspectRatio || '16:9',
  }),
  parseTaskId: (d) => 'grokv_' + (d?.id || Date.now()),
});
