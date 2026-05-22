// Kie AI - Flux Pro
const { createTask, pollTask } = require('./base');

module.exports = async function fluxPro(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    width: input.width || 1024,
    height: input.height || 1024,
    steps: input.steps || 50,
    guidance: input.guidance || 4,
    seed: input.seed || -1,
    outputFormat: input.outputFormat || 'png'
  };

  const res = await createTask('/api/v1/image/flux-pro', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};