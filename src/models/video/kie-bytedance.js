const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'kie-bytedance', provider: 'kie', kind: 'video', label: 'ByteDance',
  baseURL: 'https://api.kie.ai', envKey: 'KIE_AI_API_KEY', modelName: 'bytedance',
});
