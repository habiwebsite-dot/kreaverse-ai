const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'google-gemini', provider: 'gemini', kind: 'chat', label: 'Gemini 1.5 Pro',
  baseURL: 'https://generativelanguage.googleapis.com', envKey: 'GEMINI_API_KEY', headerStyle: 'google',
  modelName: 'gemini-1.5-pro',
  paths: { create: '/v1beta/models/gemini-1.5-pro:generateContent' },
  buildBody: (input) => ({
    contents: [{ role: 'user', parts: [{ text: input.prompt || '' }] }],
  }),
  parseTaskId: () => 'gemchat_' + Date.now(),
  parseInfo: () => ({ state: 2 }),
});
