// Kie AI - Music Cover (AI Cover Song)
const { createTask, pollTask } = require('./base');

module.exports = async function musicCover(input, apiKey) {
  const payload = {
    audioUrl: input.audioUrl || input.fileUrl,
    title: input.title || '',
    style: input.style || '',
    lyrics: input.lyrics || '',
    vocalGender: input.vocalGender || 'female',
    negativeTags: input.negativeTags || '',
    styleWeight: parseFloat(input.styleWeight) || 1.0,
    weirdnessConstraint: parseFloat(input.weirdnessConstraint) || 0.5,
    audioWeight: parseFloat(input.audioWeight) || 1.0
  };

  if (!payload.audioUrl) return { success: false, error: 'audioUrl wajib untuk Music Cover' };

  const res = await createTask('/api/v1/audio/cover', payload, apiKey);
  if (!res.success) return { success: false, error: res.error };

  const taskId = res.data?.data?.taskId || res.data?.taskId;
  if (!taskId) return { success: false, error: 'Tidak mendapat taskId' };

  const pollResult = await pollTask(taskId, apiKey, 90);
  if (pollResult.failed) return { success: false, error: pollResult.error };
  return { success: true, taskId, data: pollResult.data };
};