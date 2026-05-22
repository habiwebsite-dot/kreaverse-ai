// Kie AI - Suno v4 Music Generation
const { createTask, pollTask } = require('./base');

module.exports = async function sunoV4(input, apiKey) {
  const payload = {
    prompt: input.prompt,
    lyrics: input.lyrics || '',
    style: input.style || '',
    title: input.title || '',
    makeInstrumental: input.makeInstrumental || false,
    model: 'v4'
  };

  const res = await createTask('/api/v1/audio/suno', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey, 60);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};