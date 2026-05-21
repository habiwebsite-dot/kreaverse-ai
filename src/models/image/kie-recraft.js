const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-recraft', provider: 'kie', kind: 'image', label: 'Recraft',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'recraft',
});
