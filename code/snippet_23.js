// Model Registry - semua handler model AI

const handlers = {};

function register(provider, model, handler) {
  if (!handlers[provider]) handlers[provider] = {};
  handlers[provider][model] = handler;
}

function getHandler(provider, model) {
  return handlers[provider]?.[model] || null;
}

function getAllModels() {
  const result = {};
  for (const [provider, models] of Object.entries(handlers)) {
    result[provider] = Object.keys(models).map(model => ({ provider, model }));
  }
  return result;
}

// ─── Load all model handlers ─────────────────────────────────────────────────
require('./kie-ai/register')(register);
require('./api-box/register')(register);
require('./apiframe/register')(register);
require('./crun/register')(register);
require('./sunoapi/register')(register);
require('./evolink/register')(register);
require('./aimastering/register')(register);
require('./deepseek/register')(register);
require('./leonardo/register')(register);
require('./gemini/register')(register);
require('./grok/register')(register);

module.exports = { register, getHandler, getAllModels };