const { createTask, pollTask } = require('./base');

module.exports = async function klingI2V(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    imageUrl: input.imageUrl || input.fileUrl,
    duration: input.duration || 5,
    aspectRatio: input.aspectRatio || '16:9',
    mode: input.mode || 'standard',
    cfgScale: input.cfgScale || 0.5
  };

  if (!payload.imageUrl) return { success: false, error: 'imageUrl wajib untuk Image-to-Video' };

  const res = await createTask('/api/v1/video/kling-i2v', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey, 90);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};