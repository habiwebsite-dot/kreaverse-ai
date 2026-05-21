const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-hailuo', provider: 'kie', kind: 'video', label: 'Hailuo',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'hailuo',
});
