const { errorResponse } = require('../utils/helpers');

/**
 * Optional gateway authentication middleware
 * Set API_SECRET_KEY in .env to enable
 */
const authMiddleware = (req, res, next) => {
  // Skip auth if no secret key configured
  if (!process.env.API_SECRET_KEY) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return errorResponse(res, 'API key required. Pass via X-API-Key header', 401);
  }

  if (apiKey !== process.env.API_SECRET_KEY) {
    return errorResponse(res, 'Invalid API key', 403);
  }

  next();
};

module.exports = authMiddleware;
