import express from 'express';
import { getAllQuizHistory, saveQuizAttempt } from '../database/db.js';

const router = express.Router();

/**
 * GET /api/quiz/history
 * Returns the full quiz attempt history from SQLite
 */
router.get('/history', async (req, res) => {
  try {
    const history = await getAllQuizHistory();
    res.json(history);
  } catch (error) {
    console.error('[API GET /api/quiz/history] Error:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz history', details: error.message });
  }
});

/**
 * POST /api/quiz/attempt
 * Saves a completed quiz result into SQLite and updates topic mastery score
 */
router.post('/attempt', async (req, res) => {
  try {
    const attempt = req.body;
    if (!attempt || attempt.score === undefined || !attempt.topicId) {
      return res.status(400).json({ error: 'Valid attempt data with topicId and score is required' });
    }
    const saved = await saveQuizAttempt(attempt);
    res.status(201).json(saved);
  } catch (error) {
    console.error('[API POST /api/quiz/attempt] Error:', error);
    res.status(500).json({ error: 'Failed to record quiz attempt', details: error.message });
  }
});

export default router;
