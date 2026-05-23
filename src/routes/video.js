const express = require('express');
const router = express.Router();
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse, validateRequired } = require('../utils/helpers');

router.use(authMiddleware);

// ─── Helper: build optional params ───────────────────────────────────────────
const buildParams = (required, optional) => {
  const params = { ...required };
  Object.entries(optional).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params[k] = v;
  });
  return params;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEEDANCE 2.0
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/seedance20/text-to-video', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, fps, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.seedance20TextToVideo(
      buildParams({ prompt }, { duration, resolution, fps, seed })
    );
    return successResponse(res, result, 200, { model: 'seedance-2.0', mode: 'text-to-video' });
  } catch (err) { next(err); }
});

router.post('/seedance20/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration, resolution, fps, seed } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.seedance20ImageToVideo(
      buildParams({ image_url }, { prompt, duration, resolution, fps, seed })
    );
    return successResponse(res, result, 200, { model: 'seedance-2.0', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

router.post('/seedance20/reference-to-video', async (req, res, next) => {
  try {
    const { reference_image_url, prompt, duration, resolution } = req.body;
    const missing = validateRequired(req.body, ['reference_image_url', 'prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.seedance20ReferenceToVideo(
      buildParams({ reference_image_url, prompt }, { duration, resolution })
    );
    return successResponse(res, result, 200, { model: 'seedance-2.0', mode: 'reference-to-video' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HAPPYHORSE 1.0
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/happyhorse/text-to-video', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, seed, style } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.happyhorse10TextToVideo(
      buildParams({ prompt }, { duration, resolution, seed, style })
    );
    return successResponse(res, result, 200, { model: 'happyhorse-1.0', mode: 'text-to-video' });
  } catch (err) { next(err); }
});

router.post('/happyhorse/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration, motion_strength } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.happyhorse10ImageToVideo(
      buildParams({ image_url }, { prompt, duration, motion_strength })
    );
    return successResponse(res, result, 200, { model: 'happyhorse-1.0', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

router.post('/happyhorse/reference-to-video', async (req, res, next) => {
  try {
    const { reference_image_url, prompt, duration } = req.body;
    const missing = validateRequired(req.body, ['reference_image_url', 'prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.happyhorse10ReferenceToVideo(
      buildParams({ reference_image_url, prompt }, { duration })
    );
    return successResponse(res, result, 200, { model: 'happyhorse-1.0', mode: 'reference-to-video' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SORA 2
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/sora2/generate', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, loop, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.sora2Generate(
      buildParams({ prompt }, { duration, resolution, loop, seed })
    );
    return successResponse(res, result, 200, { model: 'sora-2-preview' });
  } catch (err) { next(err); }
});

router.post('/sora2pro/generate', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, loop, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.sora2ProGenerate(
      buildParams({ prompt }, { duration, resolution, loop, seed })
    );
    return successResponse(res, result, 200, { model: 'sora-2-pro-preview' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// VEO 3.1
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/veo31/generate', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, aspect_ratio, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.veo31Generate(
      buildParams({ prompt }, { duration, resolution, aspect_ratio, seed })
    );
    return successResponse(res, result, 200, { model: 'veo-3.1', tier: 'standard' });
  } catch (err) { next(err); }
});

router.post('/veo31/fast', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, aspect_ratio } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.veo31FastGenerate(
      buildParams({ prompt }, { duration, resolution, aspect_ratio })
    );
    return successResponse(res, result, 200, { model: 'veo-3.1', tier: 'fast' });
  } catch (err) { next(err); }
});

router.post('/veo31/pro', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, aspect_ratio, seed, quality } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.veo31ProGenerate(
      buildParams({ prompt }, { duration, resolution, aspect_ratio, seed, quality })
    );
    return successResponse(res, result, 200, { model: 'veo-3.1', tier: 'pro' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// WAN 2.7
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/wan27/text-to-video', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, duration, resolution, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.wan27TextToVideo(
      buildParams({ prompt }, { negative_prompt, duration, resolution, seed })
    );
    return successResponse(res, result, 200, { model: 'wan-2.7', mode: 'text-to-video' });
  } catch (err) { next(err); }
});

router.post('/wan27/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, negative_prompt, duration, seed } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.wan27ImageToVideo(
      buildParams({ image_url }, { prompt, negative_prompt, duration, seed })
    );
    return successResponse(res, result, 200, { model: 'wan-2.7', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

router.post('/wan27/reference', async (req, res, next) => {
  try {
    const { reference_image_url, prompt, duration } = req.body;
    const missing = validateRequired(req.body, ['reference_image_url', 'prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.wan27ReferenceVideo(
      buildParams({ reference_image_url, prompt }, { duration })
    );
    return successResponse(res, result, 200, { model: 'wan-2.7', mode: 'reference-to-video' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// KLING
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/kling/o3/text-to-video', async (req, res, next) => {
  try {
    const { prompt, duration, aspect_ratio, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingO3TextToVideo(
      buildParams({ prompt }, { duration, aspect_ratio, seed })
    );
    return successResponse(res, result, 200, { model: 'kling-o3', mode: 'text-to-video' });
  } catch (err) { next(err); }
});

router.post('/kling/o3/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration, aspect_ratio } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingO3ImageToVideo(
      buildParams({ image_url }, { prompt, duration, aspect_ratio })
    );
    return successResponse(res, result, 200, { model: 'kling-o3', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

router.post('/kling/o3/reference', async (req, res, next) => {
  try {
    const { reference_image_url, prompt, duration } = req.body;
    const missing = validateRequired(req.body, ['reference_image_url', 'prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingO3ReferenceToVideo(
      buildParams({ reference_image_url, prompt }, { duration })
    );
    return successResponse(res, result, 200, { model: 'kling-o3', mode: 'reference-to-video' });
  } catch (err) { next(err); }
});

router.post('/kling/v3/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration, aspect_ratio, motion_strength } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingV3ImageToVideo(
      buildParams({ image_url }, { prompt, duration, aspect_ratio, motion_strength })
    );
    return successResponse(res, result, 200, { model: 'kling-v3', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

router.post('/kling/v3/motion-control', async (req, res, next) => {
  try {
    const { image_url, motion_type, motion_strength, duration } = req.body;
    const missing = validateRequired(req.body, ['image_url', 'motion_type']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingV3MotionControl(
      buildParams({ image_url, motion_type }, { motion_strength, duration })
    );
    return successResponse(res, result, 200, { model: 'kling-v3', mode: 'motion-control' });
  } catch (err) { next(err); }
});

router.post('/kling/o1/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration, aspect_ratio } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.klingO1ImageToVideo(
      buildParams({ image_url }, { prompt, duration, aspect_ratio })
    );
    return successResponse(res, result, 200, { model: 'kling-o1', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GROK
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/grok/text-to-video', async (req, res, next) => {
  try {
    const { prompt, duration, resolution, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.grokTextToVideo(
      buildParams({ prompt }, { duration, resolution, seed })
    );
    return successResponse(res, result, 200, { model: 'grok-imagine', mode: 'text-to-video' });
  } catch (err) { next(err); }
});

router.post('/grok/image-to-video', async (req, res, next) => {
  try {
    const { image_url, prompt, duration } = req.body;
    const missing = validateRequired(req.body, ['image_url']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.grokImageToVideo(
      buildParams({ image_url }, { prompt, duration })
    );
    return successResponse(res, result, 200, { model: 'grok-imagine', mode: 'image-to-video' });
  } catch (err) { next(err); }
});

module.exports = router;
