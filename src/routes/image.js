const express = require('express');
const router = express.Router();
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse, validateRequired } = require('../utils/helpers');

router.use(authMiddleware);

// ─── Nanobanana-2 ─────────────────────────────────────────────────────────────
router.post('/nanobanana2/generate', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, width, height, steps, guidance_scale, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.nanobanana2Generate({
      prompt,
      ...(negative_prompt && { negative_prompt }),
      ...(width && { width }),
      ...(height && { height }),
      ...(steps && { steps }),
      ...(guidance_scale && { guidance_scale }),
      ...(seed !== undefined && { seed })
    });

    return successResponse(res, result, 200, { model: 'nanobanana-2' });
  } catch (err) { next(err); }
});

// ─── Nanobanana Pro ───────────────────────────────────────────────────────────
router.post('/nanobanana-pro/generate', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, width, height, steps, guidance_scale, seed, style } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.nanobananaProGenerate({
      prompt,
      ...(negative_prompt && { negative_prompt }),
      ...(width && { width }),
      ...(height && { height }),
      ...(steps && { steps }),
      ...(guidance_scale && { guidance_scale }),
      ...(seed !== undefined && { seed }),
      ...(style && { style })
    });

    return successResponse(res, result, 200, { model: 'nanobanana-pro' });
  } catch (err) { next(err); }
});

// ─── Nanobanana ───────────────────────────────────────────────────────────────
router.post('/nanobanana/generate', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, width, height, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.nanobananaGenerate({
      prompt,
      ...(negative_prompt && { negative_prompt }),
      ...(width && { width }),
      ...(height && { height }),
      ...(seed !== undefined && { seed })
    });

    return successResponse(res, result, 200, { model: 'nanobanana' });
  } catch (err) { next(err); }
});

// ─── Midjourney V7 ────────────────────────────────────────────────────────────
router.post('/midjourney/v7/generate', async (req, res, next) => {
  try {
    const { prompt, aspect_ratio, version, quality, style, chaos, seed } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.midjourneyV7Generate({
      prompt,
      ...(aspect_ratio && { aspect_ratio }),
      ...(version && { version }),
      ...(quality && { quality }),
      ...(style && { style }),
      ...(chaos !== undefined && { chaos }),
      ...(seed !== undefined && { seed })
    });

    return successResponse(res, result, 200, { model: 'midjourney-v7' });
  } catch (err) { next(err); }
});

// ─── GPT-4O Image ─────────────────────────────────────────────────────────────
router.post('/gpt4o/generate', async (req, res, next) => {
  try {
    const { prompt, size, quality, style, n } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.gpt4oImageGenerate({
      prompt,
      ...(size && { size }),
      ...(quality && { quality }),
      ...(style && { style }),
      ...(n && { n })
    });

    return successResponse(res, result, 200, { model: 'gpt-4o-image' });
  } catch (err) { next(err); }
});

// ─── GPT Image 2 ──────────────────────────────────────────────────────────────
router.post('/gpt-image-2/generate', async (req, res, next) => {
  try {
    const { prompt, size, quality, output_format, background, n } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.gptImage2Generate({
      prompt,
      ...(size && { size }),
      ...(quality && { quality }),
      ...(output_format && { output_format }),
      ...(background && { background }),
      ...(n && { n })
    });

    return successResponse(res, result, 200, { model: 'gpt-image-2' });
  } catch (err) { next(err); }
});

// ─── Seedream 5.0 Lite ────────────────────────────────────────────────────────
router.post('/seedream/generate', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, aspect_ratio, seed, guidance_scale } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.seedream50LiteGenerate({
      prompt,
      ...(negative_prompt && { negative_prompt }),
      ...(aspect_ratio && { aspect_ratio }),
      ...(seed !== undefined && { seed }),
      ...(guidance_scale && { guidance_scale })
    });

    return successResponse(res, result, 200, { model: 'seedream-5.0-lite' });
  } catch (err) { next(err); }
});

// ─── Wan2.5 Image to Image ────────────────────────────────────────────────────
router.post('/wan25/image-to-image', async (req, res, next) => {
  try {
    const { image_url, prompt, strength, negative_prompt, seed } = req.body;
    const missing = validateRequired(req.body, ['image_url', 'prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.wan25ImageToImage({
      image_url,
      prompt,
      ...(strength !== undefined && { strength }),
      ...(negative_prompt && { negative_prompt }),
      ...(seed !== undefined && { seed })
    });

    return successResponse(res, result, 200, { model: 'wan2.5-image-to-image' });
  } catch (err) { next(err); }
});

// ─── Wan2.5 Text to Image ─────────────────────────────────────────────────────
router.post('/wan25/text-to-image', async (req, res, next) => {
  try {
    const { prompt, negative_prompt, width, height, seed, steps } = req.body;
    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) return errorResponse(res, `Missing: ${missing.join(', ')}`, 400);

    const result = await evolinkService.wan25TextToImage({
      prompt,
      ...(negative_prompt && { negative_prompt }),
      ...(width && { width }),
      ...(height && { height }),
      ...(seed !== undefined && { seed }),
      ...(steps && { steps })
    });

    return successResponse(res, result, 200, { model: 'wan2.5-text-to-image' });
  } catch (err) { next(err); }
});

module.exports = router;
