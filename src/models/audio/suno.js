/**
 * kreaverse-ai :: Suno API (sunoapi.org)
 * Mendukung MUSIC COVER: judul, style, lirik, vocal, negative tags,
 * style_weight, weirdness_constraint, audio_weight.
 */
const { createAdapter } = require('../_factory');

module.exports = createAdapter({
  id: 'suno', provider: 'suno', kind: 'audio', label: 'Suno Music',
  baseURL: 'https://api.sunoapi.org', envKey: 'SUNO_API_KEY',
  modelName: 'chirp-v4',
  paths: {
    create: '/api/v1/generate',
    info: (tid) => `/api/v1/generate/record-info?taskId=${encodeURIComponent(tid)}`,
  },
  buildBody: (input, model) => ({
    model,
    title: input.title || 'Untitled',
    style: input.style || '',
    prompt: input.lyrics || input.prompt || '',
    customMode: true,
    instrumental: !!input.instrumental,
    voice: input.vocal || 'male',          // male / female
    negativeTags: input.negativeTags || '',
    styleWeight: Number(input.styleWeight ?? 0.65),
    weirdnessConstraint: Number(input.weirdnessConstraint ?? 0.5),
    audioWeight: Number(input.audioWeight ?? 0.65),
    referenceAudioUrl: input.audioUrl || undefined,
    callBackUrl: input.callBackUrl,
  }),
  parseTaskId: (d) => d?.data?.taskId || d?.taskId || ('suno_' + Date.now()),
  parseInfo: (d) => {
    if (!d) return { state: 1 };
    const status = (d?.data?.status || d?.status || '').toLowerCase();
    const map = { pending: 0, queueing: 0, generating: 1, processing: 1, success: 2, complete: 2, fail: 3, failed: 3 };
    const urls = (d?.data?.response?.sunoData || []).map((x) => x.audioUrl).filter(Boolean);
    return {
      state: map[status] ?? 1,
      resultJson: urls.length ? { resultUrls: urls } : (d?.data || null),
    };
  },
});
