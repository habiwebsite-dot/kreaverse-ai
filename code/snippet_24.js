module.exports = function(register) {
  const base = require('./base');

  // Image models
  register('kie-ai', 'seedream', require('./seedream'));
  register('kie-ai', 'flux', require('./flux'));
  register('kie-ai', 'flux-pro', require('./flux-pro'));
  register('kie-ai', 'stable-diffusion-3', require('./stable-diffusion'));
  register('kie-ai', 'kolors', require('./kolors'));
  register('kie-ai', 'ideogram', require('./ideogram'));
  register('kie-ai', 'img2img', require('./img2img'));

  // Video models
  register('kie-ai', 'wan-t2v', require('./wan-t2v'));
  register('kie-ai', 'wan-i2v', require('./wan-i2v'));
  register('kie-ai', 'kling-t2v', require('./kling-t2v'));
  register('kie-ai', 'kling-i2v', require('./kling-i2v'));
  register('kie-ai', 'hailuo-t2v', require('./hailuo-t2v'));

  // Audio models  
  register('kie-ai', 'suno-v4', require('./suno-v4'));
  register('kie-ai', 'music-cover', require('./music-cover'));

  // Chat models
  register('kie-ai', 'chat', require('./chat'));
};