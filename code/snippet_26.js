// Kie AI - SeeDream (Text-to-Image)
// Ref: https://docs.kie.ai
const { createTask, pollTask } = require('./base');

module.exports = async function seedream(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    width: input.width || 1024,
    height: input.height || 1024,
    steps: input.steps || 20,
    cfgScale: input.cfgScale || 7,
    seed: input.seed || -1,
    style: input.style || 'realistic'
  };

  const res = await createTask('/api/v1/image/seedream', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId dari provider' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };

  return { success: true, taskId, data: { ...pollResult.data, resultUrls: pollResult.data.resultUrls } };
};