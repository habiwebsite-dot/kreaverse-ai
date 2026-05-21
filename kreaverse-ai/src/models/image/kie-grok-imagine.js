const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-grok-imagine', provider: 'kie', kind: 'image', label: 'Grok Imagine',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'grok-imagine',
});
