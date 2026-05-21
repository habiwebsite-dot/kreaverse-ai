const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-kling', provider: 'kie', kind: 'video', label: 'Kling',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'kling',
});
