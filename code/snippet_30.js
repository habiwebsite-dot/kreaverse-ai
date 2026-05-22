const { createTask, pollTask } = require('./base');

module.exports = async function kolors(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    width: input.width || 1024,
    height: input.height || 1024,
    steps: input.steps || 50,
    cfgScale: input.cfgScale || 5,
    seed: input.seed || -1,
    scheduler: input.scheduler || 'EulerDiscreteScheduler'
  };

  const res = await createTask('/api/v1/image/kolors', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};