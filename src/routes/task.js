const express = require('express');
const router = express.Router();
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

router.use(authMiddleware);

/**
 * GET /api/task/errors/list
 * Get error codes reference
 * NOTE: Must be defined BEFORE /:taskId to avoid route conflict
 */
router.get('/errors/list', (req, res) => {
  const errorCodes = {
    general: {
      1000: 'Success',
      1001: 'Invalid API key',
      1002: 'Insufficient credits',
      1003: 'Rate limit exceeded',
      1004: 'Invalid parameters',
      1005: 'Model not available'
    },
    task: {
      2000: 'Task created',
      2001: 'Task processing',
      2002: 'Task completed',
      2003: 'Task failed',
      2004: 'Task timeout',
      2005: 'Task cancelled'
    },
    file: {
      3000: 'File upload success',
      3001: 'File too large',
      3002: 'Invalid file type',
      3003: 'File quota exceeded',
      3004: 'URL not accessible'
    }
  };

  return res.json({
    success: true,
    data: errorCodes,
    reference: 'https://docs.evolink.ai/en/api-manual/task-management/error-codes'
  });
});

/**
 * GET /api/task/:taskId
 * Get task detail / status
 */
router.get('/:taskId', async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return errorResponse(res, 'Task ID is required', 400);
    }

    const result = await evolinkService.getTaskDetail(taskId);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
