// Kie AI - Stable Diffusion 3
const { createTask, pollTask } = require('./base');

module.exports = async function stableDiffusion(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    aspectRatio: input.aspectRatio || '1:1',
    model: 'sd3-medium',
    outputFormat: input.outputFormat || 'png'
  };

  const res = await createTask('/api/v1/image/sd3', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};