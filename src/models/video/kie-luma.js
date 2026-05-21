const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-luma', provider: 'kie', kind: 'video', label: 'Luma',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'luma',
});
