const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-flux', provider: 'kie', kind: 'image', label: 'Flux',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'flux',
});
