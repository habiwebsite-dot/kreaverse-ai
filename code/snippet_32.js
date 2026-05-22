// Kie AI - Image to Image
const { createTask, pollTask } = require('./base');

module.exports = async function img2img(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    initImageUrl: input.initImageUrl || input.fileUrl,
    strength: input.strength || 0.7,
    width: input.width || 1024,
    height: input.height || 1024,
    steps: input.steps || 30,
    cfgScale: input.cfgScale || 7,
    // Multi reference support
    photo1: input.photo1 || null,
    photo2: input.photo2 || null,
    photo3: input.photo3 || null,
    photo4: input.photo4 || null,
    photo5: input.photo5 || null
  };

  const res = await createTask('/api/v1/image/img2img', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};