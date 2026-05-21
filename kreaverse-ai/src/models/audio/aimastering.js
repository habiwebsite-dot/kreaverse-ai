/**
 * kreaverse-ai :: AI Mastering (aimastering.com)
 * Easy + Custom mastering parameters.
 */
const { createAdapter } = require('../_factory');

module.exports = createAdapter({
  id: 'aimastering', provider: 'aimastering', kind: 'audio', label: 'AI Mastering',
  baseURL: 'https://aimastering.com', envKey: 'AIMASTERING_API_KEY',
  modelName: 'master-v3',
  paths: {
    create: '/api/v1/masterings',
    info: (tid) => `/api/v1/masterings/${encodeURIComponent(tid)}`,
  },
  buildBody: (input) => ({
    input_audio_url: input.audioUrl,
    reference_audio_url: input.referenceAudioUrl || null,
    mode: input.mode || 'default',                              // easy / custom
    target_loudness_mode: input.targetLoudnessMode || 'loudness',
    target_loudness: Number(input.targetLoudness ?? -8),
    ceiling_mode: input.ceilingMode || 'peak',
    ceiling: Number(input.ceiling ?? -0.1),
    oversample: input.oversample ?? 2,
    mastering_algorithm: input.algorithm || 'v2',
    output_format: input.outputFormat || 'wav',
    sample_rate: Number(input.sampleRate ?? 44100),
    low_cut_freq: Number(input.lowCutFreq ?? 20),
    high_cut_freq: Number(input.highCutFreq ?? 20000),
    preserve_low_frequency: !!input.preserveBass,
    limiter: input.limiter ?? true,
    automatic_mastering_level: Number(input.automaticLevel ?? 0.5),
  }),
  parseTaskId: (d) => d?.id || ('aim_' + Date.now()),
  parseInfo: (d) => {
    const map = { waiting: 0, processing: 1, succeeded: 2, failed: 3 };
    return {
      state: map[d?.status] ?? 1,
      resultJson: d?.output_audio_download_url ? { resultUrls: [d.output_audio_download_url] } : null,
    };
  },
});
