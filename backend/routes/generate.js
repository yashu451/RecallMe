import express from 'express';
import { generateWithGemini } from '../services/geminiService.js';
import { saveTopic } from '../database/db.js';

const router = express.Router();

/**
 * POST /api/generate
 * Accepts raw text and generates comprehensive study materials via Gemini AI.
 * Optionally saves the result into SQLite directly if saveToDb is true.
 */
router.post('/', async (req, res) => {
  try {
    const { text, title, subject, options, saveToDb, userId: bodyUserId } = req.body;
    const userId = bodyUserId || req.headers['x-user-id'] || null;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Source text is required' });
    }

    console.log(`[API /api/generate] Processing text (${text.length} chars), title: "${title || 'Auto'}"`);
    const generated = await generateWithGemini(text, title, subject, options);

    if (userId) {
      generated.userId = userId;
    }

    if (saveToDb === true) {
      await saveTopic(generated);
    }

    return res.status(200).json(generated);
  } catch (error) {
    console.error('[API /api/generate] Error:', error);
    return res.status(500).json({
      error: 'Failed to generate study materials',
      details: error.message
    });
  }
});

export default router;
