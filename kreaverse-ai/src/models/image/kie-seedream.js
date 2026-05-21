const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-seedream', provider: 'kie', kind: 'image', label: 'Seedream',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'seedream',
});
