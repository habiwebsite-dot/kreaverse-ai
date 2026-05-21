const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-runway', provider: 'kie', kind: 'video', label: 'Runway',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'runway',
});
