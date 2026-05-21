const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-sora', provider: 'kie', kind: 'video', label: 'Sora',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'sora',
});
