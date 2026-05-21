const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'apiframe-kling', provider: 'apiframe', kind: 'video', label: 'Kling',
  baseURL: 'https://api.apiframe.ai', envKey: 'APIFRAME_API_KEY', modelName: 'kling',
});
