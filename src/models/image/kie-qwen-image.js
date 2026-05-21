const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-qwen-image', provider: 'kie', kind: 'image', label: 'Qwen Image',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'qwen-image',
});
