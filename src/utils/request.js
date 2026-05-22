const axios = require('axios');

const axiosInstance = axios.create({
  timeout: 30000,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API request error:', error.message);
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;