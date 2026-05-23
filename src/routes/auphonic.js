const express = require('express');
const router = express.Router();
const multer = require('multer');
const auphonicService = require('../services/auphonicService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse, validateRequired } = require('../utils/helpers');

router.use(authMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || 200) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const audioTypes = ['audio/', 'video/'];
    if (audioTypes.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error('Only audio/video files accepted'), false);
    }
  }
});

/**
 * POST /api/auphonic/production/simple
 * Simple production - upload + process in one step
 */
router.post('/production/simple', upload.single('input_file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Audio file required. Use multipart with field "input_file"', 400);
    }

    const options = {};

    // Parse JSON fields from form data
    const jsonFields = ['algorithms', 'output_files', 'chapters', 'metadata'];
    jsonFields.forEach(field => {
      if (req.body[field]) {
        try {
          options[field] = JSON.parse(req.body[field]);
        } catch {
          options[field] = req.body[field];
        }
      }
    });

    // String/boolean fields
    const directFields = [
      'title', 'artist', 'album', 'track', 'year',
      'loudness_target', 'noise_reduction', 'filtering',
      'speech_recognition', 'preset', 'action'
    ];
    directFields.forEach(field => {
      if (req.body[field] !== undefined) {
        options[field] = req.body[field];
      }
    });

    const result = await auphonicService.simpleProduction(
      req.file.buffer,
      req.file.originalname,
      options
    );

    return successResponse(res, result, 200, {
      service: 'auphonic',
      action: 'simple-production',
      file: req.file.originalname,
      size_bytes: req.file.size
    });
  } catch (err) { next(err); }
});

/**
 * POST /api/auphonic/production/start
 * Create and optionally start a full production
 */
router.post('/production/start', async (req, res, next) => {
  try {
    const {
      preset, input_file, input_url, output_basename,
      metadata, algorithms, output_files, chapters,
      speech_recognition, loudness_target, action
    } = req.body;

    const params = {
      ...(preset && { preset }),
      ...(input_file && { input_file }),
      ...(input_url && { input_url }),
      ...(output_basename && { output_basename }),
      ...(metadata && { metadata }),
      ...(algorithms && { algorithms }),
      ...(output_files && { output_files }),
      ...(chapters && { chapters }),
      ...(speech_recognition !== undefined && { speech_recognition }),
      ...(loudness_target && { loudness_target }),
      ...(action && { action })
    };

    // Create production
    const production = await auphonicService.createProduction(params);

    // Auto-start if action is 'start'
    let startResult = null;
    if (action === 'start' && production?.data?.uuid) {
      startResult = await auphonicService.startProduction(production.data.uuid);
    }

    return successResponse(res, {
      production,
      ...(startResult && { start: startResult })
    }, 201, {
      service: 'auphonic',
      action: 'create-production'
    });
  } catch (err) { next(err); }
});

/**
 * POST /api/auphonic/production/:uuid/start
 * Start an existing production
 */
router.post('/production/:uuid/start', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const result = await auphonicService.startProduction(uuid);
    return successResponse(res, result, 200, {
      service: 'auphonic',
      action: 'start-production',
      uuid
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/auphonic/production/:uuid
 * Get production status & details
 */
router.get('/production/:uuid', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const result = await auphonicService.getProduction(uuid);
    return successResponse(res, result, 200);
  } catch (err) { next(err); }
});

/**
 * DELETE /api/auphonic/production/:uuid
 * Delete a production
 */
router.delete('/production/:uuid', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const result = await auphonicService.deleteProduction(uuid);
    return successResponse(res, result, 200, {
      service: 'auphonic',
      action: 'delete-production',
      uuid
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/auphonic/productions
 * List all productions
 */
router.get('/productions', async (req, res, next) => {
  try {
    const result = await auphonicService.listProductions();
    return successResponse(res, result, 200);
  } catch (err) { next(err); }
});

/**
 * POST /api/auphonic/preset/create
 * Create a preset
 */
router.post('/preset/create', async (req, res, next) => {
  try {
    const { preset_name, ...rest } = req.body;
    const missing = validateRequired(req.body, ['preset_name']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await auphonicService.createPreset({ preset_name, ...rest });
    return successResponse(res, result, 201, {
      service: 'auphonic',
      action: 'create-preset'
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/auphonic/presets
 * Get all presets
 */
router.get('/presets', async (req, res, next) => {
  try {
    const result = await auphonicService.getPresets();
    return successResponse(res, result, 200);
  } catch (err) { next(err); }
});

/**
 * GET /api/auphonic/info
 * Get account info + service capabilities
 */
router.get('/info', async (req, res, next) => {
  try {
    const [account, service] = await Promise.all([
      auphonicService.getAccountInfo(),
      auphonicService.getServiceInfo()
    ]);
    return successResponse(res, { account, service }, 200);
  } catch (err) { next(err); }
});

module.exports = router;
