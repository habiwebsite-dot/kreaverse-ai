const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');

class AuphonicService {
  constructor() {
    this.baseURL = process.env.AUPHONIC_BASE_URL || 'https://auphonic.com/api';
    this.apiKey = process.env.AUPHONIC_API_KEY;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 minutes for audio processing
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    this.client.interceptors.request.use((config) => {
      logger.info(`→ Auphonic ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`← Auphonic ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`✗ Auphonic Error: ${error.message}`);
        throw error;
      }
    );
  }

  /**
   * Simple Production - Upload file + process in one call
   */
  async simpleProduction(fileBuffer, filename, options = {}) {
    const formData = new FormData();
    formData.append('input_file', fileBuffer, filename);

    // Append all options
    if (Object.keys(options).length > 0) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
    }

    const { data } = await this.client.post('/simple/productions.json', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return data;
  }

  /**
   * Create production (full control)
   */
  async createProduction(params) {
    const { data } = await this.client.post('/productions.json', params, {
      headers: { 'Content-Type': 'application/json' }
    });
    return data;
  }

  /**
   * Start production
   */
  async startProduction(uuid) {
    const { data } = await this.client.post(`/production/${uuid}/start.json`);
    return data;
  }

  /**
   * Get production status
   */
  async getProduction(uuid) {
    const { data } = await this.client.get(`/production/${uuid}.json`);
    return data;
  }

  /**
   * List all productions
   */
  async listProductions() {
    const { data } = await this.client.get('/productions.json');
    return data;
  }

  /**
   * Delete production
   */
  async deleteProduction(uuid) {
    const { data } = await this.client.delete(`/production/${uuid}.json`);
    return data;
  }

  /**
   * Create preset
   */
  async createPreset(params) {
    const { data } = await this.client.post('/presets.json', params, {
      headers: { 'Content-Type': 'application/json' }
    });
    return data;
  }

  /**
   * Get presets
   */
  async getPresets() {
    const { data } = await this.client.get('/presets.json');
    return data;
  }

  /**
   * Get account info
   */
  async getAccountInfo() {
    const { data } = await this.client.get('/user.json');
    return data;
  }

  /**
   * Get service capabilities
   */
  async getServiceInfo() {
    const { data } = await this.client.get('/info.json');
    return data;
  }
}

module.exports = new AuphonicService();
