const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'gemini-imagen', provider: 'gemini', kind: 'image', label: 'Imagen 3',
  baseURL: 'https://generativelanguage.googleapis.com', envKey: 'GEMINI_API_KEY',
  modelName: 'imagen-3.0-generate-002', headerStyle: 'google',
  paths: {
    create: '/v1beta/models/imagen-3.0-generate-002:predict',
    info: (tid) => `/v1beta/operations/${encodeURIComponent(tid)}`,
  },
  buildBody: (input) => ({
    instances: [{ prompt: input.prompt }],
    parameters: {
      sampleCount: input.sampleCount || 1,
      aspectRatio: input.aspectRatio || '1:1',
    },
  }),
  parseTaskId: (d) => d?.name || ('gem_' + Date.now()),
});
