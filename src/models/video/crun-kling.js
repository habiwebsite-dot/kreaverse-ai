const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'crun-kling', provider: 'crun', kind: 'video', label: 'Kling',
  baseURL: 'https://api.crun.ai', envKey: 'CRUN_AI_API_KEY', modelName: 'kling',
});
