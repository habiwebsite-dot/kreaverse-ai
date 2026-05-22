const { createTask, pollTask } = require('./base');

module.exports = async function ideogram(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    negativePrompt: input.negativePrompt || '',
    aspectRatio: input.aspectRatio || 'ASPECT_1_1',
    model: input.model || 'V_2',
    magicPromptOption: input.magicPrompt || 'AUTO',
    styleType: input.styleType || 'AUTO'
  };

  const res = await createTask('/api/v1/image/ideogram', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};