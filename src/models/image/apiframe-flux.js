const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'apiframe-flux', provider: 'apiframe', kind: 'image', label: 'Flux',
  baseURL: 'https://api.apiframe.ai', envKey: 'APIFRAME_API_KEY', modelName: 'flux',
});
