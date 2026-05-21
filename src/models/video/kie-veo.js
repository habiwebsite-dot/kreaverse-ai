const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-veo', provider: 'kie', kind: 'video', label: 'Veo',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'veo',
});
