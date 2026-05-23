/**
 * Build success response
 */
const successResponse = (res, data, statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    timestamp: new Date().toISOString(),
    ...meta,
    data
  });
};

/**
 * Build error response
 */
const errorResponse = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: message,
    ...(details && { details })
  });
};

/**
 * Validate required fields
 */
const validateRequired = (body, fields) => {
  const missing = fields.filter(field => !body[field]);
  return missing;
};

/**
 * Convert MB to bytes
 */
const mbToBytes = (mb) => mb * 1024 * 1024;

/**
 * Format file size
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
  successResponse,
  errorResponse,
  validateRequired,
  mbToBytes,
  formatBytes
};
