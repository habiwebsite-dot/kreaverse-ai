const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Axios errors from upstream APIs
  if (err.response) {
    return res.status(err.response.status || 502).json({
      success: false,
      error: 'Upstream API error',
      upstream: {
        status: err.response.status,
        data: err.response.data
      }
    });
  }

  // Network errors
  if (err.request) {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable - could not reach upstream API',
      details: err.message
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: `File too large. Maximum size: ${process.env.MAX_FILE_SIZE_MB || 50}MB`
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
