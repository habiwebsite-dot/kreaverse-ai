const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'crun-seedance', provider: 'crun', kind: 'video', label: 'Seedance',
  baseURL: 'https://api.crun.ai', envKey: 'CRUN_AI_API_KEY', modelName: 'seedance',
});
