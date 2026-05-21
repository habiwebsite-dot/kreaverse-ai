const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'elevenlabs', provider: 'evolink', kind: 'audio', label: 'ElevenLabs TTS',
  baseURL: 'https://api.elevenlabs.io', envKey: 'ELEVENLABS_API_KEY', headerStyle: 'x-api-key',
  modelName: 'eleven_multilingual_v2',
  paths: { create: '/v1/text-to-speech/stream' },
  buildBody: (input, model) => ({
    model_id: model,
    text: input.prompt || input.text || '',
    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
  }),
  parseTaskId: () => 'el_' + Date.now(),
  parseInfo: () => ({ state: 2 }),
});
