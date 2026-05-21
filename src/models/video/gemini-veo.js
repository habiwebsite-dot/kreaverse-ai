const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'gemini-veo', provider: 'gemini', kind: 'video', label: 'Veo',
  baseURL: 'https://generativelanguage.googleapis.com', envKey: 'GEMINI_API_KEY',
  modelName: 'veo-2.0-generate-001', headerStyle: 'google',
  paths: {
    create: '/v1beta/models/veo-2.0-generate-001:generateContent',
    info: (tid) => `/v1beta/operations/${encodeURIComponent(tid)}`,
  },
  buildBody: (input) => ({
    contents: [{ parts: [{ text: input.prompt }] }],
    generationConfig: {
      aspectRatio: input.aspectRatio || '16:9',
      durationSeconds: input.duration || 5,
    },
  }),
  parseTaskId: (d) => d?.name || ('veo_' + Date.now()),
});
