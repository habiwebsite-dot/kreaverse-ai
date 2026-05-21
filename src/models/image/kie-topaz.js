const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-topaz', provider: 'kie', kind: 'image', label: 'Topaz Upscale',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'topaz',
});
