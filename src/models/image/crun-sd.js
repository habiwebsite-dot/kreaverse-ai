const { createAdapter } = require('../_factory');
module.exports = createAdapter({
  id: 'crun-sd', provider: 'crun', kind: 'image', label: 'Stable Diffusion',
  baseURL: 'https://api.crun.ai', envKey: 'CRUN_AI_API_KEY', modelName: 'stable-diffusion',
});
