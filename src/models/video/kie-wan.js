const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-wan', provider: 'kie', kind: 'video', label: 'Wan',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'wan',
});
