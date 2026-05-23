const express = require('express');
const router = express.Router();
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse } = require('../utils/helpers');

router.use(authMiddleware);

/**
 * GET /api/account/credits
 * Get account credits balance
 */
router.get('/credits', async (req, res, next) => {
  try {
    const result = await evolinkService.getCredits();
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
