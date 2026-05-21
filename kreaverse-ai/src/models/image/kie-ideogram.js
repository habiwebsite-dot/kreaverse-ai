const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-ideogram', provider: 'kie', kind: 'image', label: 'Ideogram',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'ideogram',
});
