// Kie AI - Flux (Text-to-Image)
const { createTask, pollTask } = require('./base');

module.exports = async function flux(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    width: input.width || 1024,
    height: input.height || 1024,
    steps: input.steps || 28,
    guidance: input.guidance || 3.5,
    seed: input.seed || -1
  };

  const res = await createTask('/api/v1/image/flux', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId dari provider' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};