const axios = require('axios');

class RequestUtil {
  constructor() {
    this.defaultTimeout = 120000; // 2 minutes for AI generation
  }

  async post(url, data, headers = {}, timeout = this.defaultTimeout) {
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json', ...headers },
        timeout
      });
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      return this._handleError(err);
    }
  }

  async postForm(url, formData, headers = {}, timeout = this.defaultTimeout) {
    try {
      const response = await axios.post(url, formData, {
        headers: { ...formData.getHeaders?.() || {}, ...headers },
        timeout
      });
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      return this._handleError(err);
    }
  }

  async get(url, params = {}, headers = {}, timeout = this.defaultTimeout) {
    try {
      const response = await axios.get(url, {
        params,
        headers,
        timeout
      });
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      return this._handleError(err);
    }
  }

  async put(url, data, headers = {}, timeout = this.defaultTimeout) {
    try {
      const response = await axios.put(url, data, {
        headers: { 'Content-Type': 'application/json', ...headers },
        timeout
      });
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      return this._handleError(err);
    }
  }

  async delete(url, headers = {}, timeout = this.defaultTimeout) {
    try {
      const response = await axios.delete(url, { headers, timeout });
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      return this._handleError(err);
    }
  }

  _handleError(err) {
    if (err.response) {
      return {
        success: false,
        error: err.response.data?.message || err.response.data?.error || 'Provider API error',
        status: err.response.status,
        data: err.response.data
      };
    } else if (err.request) {
      return { success: false, error: 'Tidak ada respons dari provider', status: 503 };
    } else {
      return { success: false, error: err.message, status: 500 };
    }
  }

  // Polling helper with exponential backoff
  async pollUntilDone(pollFn, { maxAttempts = 60, initialDelay = 3000, maxDelay = 15000 } = {}) {
    let attempt = 0;
    let delay = initialDelay;
    while (attempt < maxAttempts) {
      await this._sleep(delay);
      const result = await pollFn();
      if (result.done) return result;
      if (result.failed) return result;
      delay = Math.min(delay * 1.2, maxDelay);
      attempt++;
    }
    return { done: false, failed: true, error: 'Timeout: task melebihi batas waktu polling' };
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new RequestUtil();