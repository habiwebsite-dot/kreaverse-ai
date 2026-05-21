const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-gpt-image', provider: 'kie', kind: 'image', label: 'GPT Image',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'gpt-image',
});
