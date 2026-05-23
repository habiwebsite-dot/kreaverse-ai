const express = require('express');
const router = express.Router();
const evolinkService = require('../services/evolinkService');
const authMiddleware = require('../middleware/auth');
const { successResponse, errorResponse, validateRequired } = require('../utils/helpers');

router.use(authMiddleware);

// ─── Suno Music Generation ────────────────────────────────────────────────────
/**
 * POST /api/audio/suno/generate
 * Generate music using Suno
 */
router.post('/suno/generate', async (req, res, next) => {
  try {
    const { prompt, style, title, tags, instrumental, duration } = req.body;

    const missing = validateRequired(req.body, ['prompt']);
    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }

    const result = await evolinkService.sunoMusicGenerate({
      prompt,
      ...(style && { style }),
      ...(title && { title }),
      ...(tags && { tags }),
      ...(instrumental !== undefined && { instrumental }),
      ...(duration && { duration })
    });

    return successResponse(res, result, 200, {
      model: 'suno-music-generation',
      action: 'generate'
    });
  } catch (err) {
    next(err);
  }
});

// ─── Suno Persona Creation ────────────────────────────────────────────────────
/**
 * POST /api/audio/suno/persona
 * Create Suno persona
 */
router.post('/suno/persona', async (req, res, next) => {
  try {
    const { name, description, style, voice_characteristics } = req.body;

    const missing = validateRequired(req.body, ['name']);
    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }

    const result = await evolinkService.sunoPersonaCreate({
      name,
      ...(description && { description }),
      ...(style && { style }),
      ...(voice_characteristics && { voice_characteristics })
    });

    return successResponse(res, result, 200, {
      model: 'suno-persona-creation',
      action: 'create'
    });
  } catch (err) {
    next(err);
  }
});

// ─── Qwen Voice Design ────────────────────────────────────────────────────────
/**
 * POST /api/audio/qwen/voice-design
 * Design custom voice with Qwen
 */
router.post('/qwen/voice-design', async (req, res, next) => {
  try {
    const { text, voice_id, language, speed, pitch, volume } = req.body;

    const missing = validateRequired(req.body, ['text']);
    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }

    const result = await evolinkService.qwenVoiceDesign({
      text,
      ...(voice_id && { voice_id }),
      ...(language && { language }),
      ...(speed && { speed }),
      ...(pitch && { pitch }),
      ...(volume && { volume })
    });

    return successResponse(res, result, 200, {
      model: 'qwen-voice-design',
      action: 'generate'
    });
  } catch (err) {
    next(err);
  }
});

// ─── Qwen3 TTS VD ────────────────────────────────────────────────────────────
/**
 * POST /api/audio/qwen/tts-vd
 * Qwen3 Text-to-Speech with Voice Design
 */
router.post('/qwen/tts-vd', async (req, res, next) => {
  try {
    const { text, voice_id, format, sample_rate, emotion } = req.body;

    const missing = validateRequired(req.body, ['text', 'voice_id']);
    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }

    const result = await evolinkService.qwenTtsVd({
      text,
      voice_id,
      ...(format && { format }),
      ...(sample_rate && { sample_rate }),
      ...(emotion && { emotion })
    });

    return successResponse(res, result, 200, {
      model: 'qwen3-tts-vd',
      action: 'generate'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
