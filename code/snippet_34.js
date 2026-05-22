// Kie AI - Wan Image-to-Video
const { createTask, pollTask } = require('./base');

module.exports = async function wanI2V(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    imageUrl: input.imageUrl || input.fileUrl || input.referenceUrl,
    resolution: input.resolution || '1280x720',
    duration: input.duration || 5,
    aspectRatio: input.aspectRatio || '16:9',
    fps: input.fps || 24
  };

  if (!payload.imageUrl) return { success: false, error: 'imageUrl wajib diisi untuk Image-to-Video' };

  const res = await createTask('/api/v1/video/wan-i2v', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey, 90);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};