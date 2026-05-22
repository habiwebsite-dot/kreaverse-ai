const { createTask, pollTask } = require('./base');

module.exports = async function klingT2V(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    duration: input.duration || 5,
    aspectRatio: input.aspectRatio || '16:9',
    mode: input.mode || 'standard',
    cfgScale: input.cfgScale || 0.5
  };

  const res = await createTask('/api/v1/video/kling-t2v', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey, 90);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};