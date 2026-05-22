// Re-export semua provider dengan model masing-masing
const providers = {
  'kie-ai': {
    seedream: require('./kie-ai/seedream'),
    flux: require('./kie-ai/flux'),
    kling: require('./kie-ai/kling'),
  },
  'api-box': {
    default: require('./api-box/default'),
  },
  'apiframe': {
    default: require('./apiframe/default'),
  },
  'crun': {
    default: require('./crun/default'),
  },
  'sunoapi': {
    music: require('./sunoapi/music'),
  },
  'evolink': {
    default: require('./evolink/default'),
  },
  'aimastering': {
    mastering: require('./aimastering/mastering'),
  },
  'deepseek': {
    chat: require('./deepseek/chat'),
  },
  'leonardo': {
    image: require('./leonardo/image'),
  },
  'gemini': {
    chat: require('./gemini/chat'),
  },
  'grok': {
    chat: require('./grok/chat'),
  },
};

function getModel(provider, model) {
  if (providers[provider] && providers[provider][model]) {
    return providers[provider][model];
  }
  return null;
}

module.exports = { getModel, providers };