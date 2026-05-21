const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-google-imagen', provider: 'kie', kind: 'image', label: 'Google Imagen',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'google-imagen',
});
