const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'leonardo-image', provider: 'leonardo', kind: 'image', label: 'Leonardo Image',
  baseURL: 'https://cloud.leonardo.ai/api/rest', envKey: 'LEONARDO_API_KEY', modelName: 'leonardo',
});
