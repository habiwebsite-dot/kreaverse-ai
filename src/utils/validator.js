function validateCreateTask(body) {
  const { provider, model, input } = body;
  if (!provider || !model || !input) return { valid: false, message: 'provider, model, dan input wajib diisi' };
  return { valid: true };
}
module.exports = { validateCreateTask };