const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-nano-banana', provider: 'kie', kind: 'image', label: 'Nano Banana',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'nano-banana',
});
