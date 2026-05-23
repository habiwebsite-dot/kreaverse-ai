const axios = require('axios');
const logger = require('../utils/logger');

class EvoLinkService {
  constructor() {
    this.baseURL = process.env.EVOLINK_BASE_URL || 'https://api.evolink.ai';
    this.apiKey = process.env.EVOLINK_API_KEY;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 120000, // 2 minutes for generation tasks
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use((config) => {
      logger.info(`→ EvoLink ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`← EvoLink ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`✗ EvoLink Error: ${error.message}`);
        throw error;
      }
    );
  }

  // ─── Audio ──────────────────────────────────────────────────────────────────

  async sunoMusicGenerate(params) {
    const { data } = await this.client.post('/v1/audio/suno/generate', params);
    return data;
  }

  async sunoPersonaCreate(params) {
    const { data } = await this.client.post('/v1/audio/suno/persona', params);
    return data;
  }

  async qwenVoiceDesign(params) {
    const { data } = await this.client.post('/v1/audio/qwen/voice-design', params);
    return data;
  }

  async qwenTtsVd(params) {
    const { data } = await this.client.post('/v1/audio/qwen/tts-vd', params);
    return data;
  }

  // ─── Image ──────────────────────────────────────────────────────────────────

  async nanobanana2Generate(params) {
    const { data } = await this.client.post('/v1/image/nanobanana2/generate', params);
    return data;
  }

  async nanobananaProGenerate(params) {
    const { data } = await this.client.post('/v1/image/nanobanana-pro/generate', params);
    return data;
  }

  async nanobananaGenerate(params) {
    const { data } = await this.client.post('/v1/image/nanobanana/generate', params);
    return data;
  }

  async midjourneyV7Generate(params) {
    const { data } = await this.client.post('/v1/image/midjourney/v7/generate', params);
    return data;
  }

  async gpt4oImageGenerate(params) {
    const { data } = await this.client.post('/v1/image/gpt4o/generate', params);
    return data;
  }

  async gptImage2Generate(params) {
    const { data } = await this.client.post('/v1/image/gpt-image-2/generate', params);
    return data;
  }

  async seedream50LiteGenerate(params) {
    const { data } = await this.client.post('/v1/image/seedream/generate', params);
    return data;
  }

  async wan25ImageToImage(params) {
    const { data } = await this.client.post('/v1/image/wan25/image-to-image', params);
    return data;
  }

  async wan25TextToImage(params) {
    const { data } = await this.client.post('/v1/image/wan25/text-to-image', params);
    return data;
  }

  // ─── Video ──────────────────────────────────────────────────────────────────

  async seedance20TextToVideo(params) {
    const { data } = await this.client.post('/v1/video/seedance20/text-to-video', params);
    return data;
  }

  async seedance20ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/seedance20/image-to-video', params);
    return data;
  }

  async seedance20ReferenceToVideo(params) {
    const { data } = await this.client.post('/v1/video/seedance20/reference-to-video', params);
    return data;
  }

  async happyhorse10TextToVideo(params) {
    const { data } = await this.client.post('/v1/video/happyhorse/text-to-video', params);
    return data;
  }

  async happyhorse10ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/happyhorse/image-to-video', params);
    return data;
  }

  async happyhorse10ReferenceToVideo(params) {
    const { data } = await this.client.post('/v1/video/happyhorse/reference-to-video', params);
    return data;
  }

  async sora2Generate(params) {
    const { data } = await this.client.post('/v1/video/sora2/generate', params);
    return data;
  }

  async sora2ProGenerate(params) {
    const { data } = await this.client.post('/v1/video/sora2pro/generate', params);
    return data;
  }

  async veo31Generate(params) {
    const { data } = await this.client.post('/v1/video/veo31/generate', params);
    return data;
  }

  async veo31FastGenerate(params) {
    const { data } = await this.client.post('/v1/video/veo31/fast', params);
    return data;
  }

  async veo31ProGenerate(params) {
    const { data } = await this.client.post('/v1/video/veo31/pro', params);
    return data;
  }

  async wan27TextToVideo(params) {
    const { data } = await this.client.post('/v1/video/wan27/text-to-video', params);
    return data;
  }

  async wan27ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/wan27/image-to-video', params);
    return data;
  }

  async wan27ReferenceVideo(params) {
    const { data } = await this.client.post('/v1/video/wan27/reference', params);
    return data;
  }

  async klingO3TextToVideo(params) {
    const { data } = await this.client.post('/v1/video/kling/o3/text-to-video', params);
    return data;
  }

  async klingO3ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/kling/o3/image-to-video', params);
    return data;
  }

  async klingO3ReferenceToVideo(params) {
    const { data } = await this.client.post('/v1/video/kling/o3/reference', params);
    return data;
  }

  async klingV3ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/kling/v3/image-to-video', params);
    return data;
  }

  async klingV3MotionControl(params) {
    const { data } = await this.client.post('/v1/video/kling/v3/motion-control', params);
    return data;
  }

  async klingO1ImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/kling/o1/image-to-video', params);
    return data;
  }

  async grokTextToVideo(params) {
    const { data } = await this.client.post('/v1/video/grok/text-to-video', params);
    return data;
  }

  async grokImageToVideo(params) {
    const { data } = await this.client.post('/v1/video/grok/image-to-video', params);
    return data;
  }

  // ─── Account ────────────────────────────────────────────────────────────────

  async getCredits() {
    const { data } = await this.client.get('/v1/account/credits');
    return data;
  }

  // ─── Task ───────────────────────────────────────────────────────────────────

  async getTaskDetail(taskId) {
    const { data } = await this.client.get(`/v1/task/${taskId}`);
    return data;
  }

  // ─── File ───────────────────────────────────────────────────────────────────

  async uploadBase64(params) {
    const { data } = await this.client.post('/v1/file/upload/base64', params);
    return data;
  }

  async uploadStream(formData) {
    const { data } = await this.client.post('/v1/file/upload/stream', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return data;
  }

  async uploadUrl(params) {
    const { data } = await this.client.post('/v1/file/upload/url', params);
    return data;
  }

  async getFileQuota() {
    const { data } = await this.client.get('/v1/file/quota');
    return data;
  }
}

module.exports = new EvoLinkService();
