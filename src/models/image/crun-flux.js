const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'crun-flux', provider: 'crun', kind: 'image', label: 'Flux',
  baseURL: 'https://api.crun.ai', envKey: 'CRUN_AI_API_KEY', modelName: 'flux',
});
