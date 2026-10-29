import express from 'express';
import { getAllQuizHistory, saveQuizAttempt, getTopicById, getTopicsByIds } from '../database/db.js';
import { generateQuizFromNotes } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/quiz/generate
 * Generates quiz questions strictly grounded in the user's selected study notes
 */
router.post('/generate', async (req, res) => {
  try {
    const { noteIds, notes: passedNotes, difficulty = 'Medium', count = 5 } = req.body;
    const numQuestions = Math.min(Math.max(parseInt(count) || 5, 1), 20);

    let notesToUse = [];

    if (Array.isArray(passedNotes) && passedNotes.length > 0) {
      notesToUse = passedNotes;
    } else if (Array.isArray(noteIds) && noteIds.length > 0) {
      notesToUse = await getTopicsByIds(noteIds);
    } else if (req.body.noteId) {
      const single = await getTopicById(req.body.noteId);
      if (single) notesToUse = [single];
    }

    if (!notesToUse || notesToUse.length === 0) {
      return res.status(400).json({
        error: 'No saved study notes found for quiz generation. Please select at least one study note from your library.'
      });
    }

    const questions = await generateQuizFromNotes(notesToUse, difficulty, numQuestions);

    res.json({
      success: true,
      questions,
      notes: notesToUse.map(n => ({ id: n.id, title: n.title, subject: n.subject })),
      count: questions.length,
      difficulty
    });
  } catch (error) {
    console.error('[API POST /api/quiz/generate] Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz from selected notes',
      details: error.message
    });
  }
});

/**
 * GET /api/quiz/history
 * Returns the full quiz attempt history from SQLite (optionally filtered by user)
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || null;
    const history = await getAllQuizHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('[API GET /api/quiz/history] Error:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz history', details: error.message });
  }
});

/**
 * GET /api/quiz/:noteId
 * Returns quiz questions for a specific study note
 */
router.get('/:noteId', async (req, res) => {
  try {
    const note = await getTopicById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ error: 'Study note not found' });
    }

    const difficulty = req.query.difficulty || 'Medium';
    const count = parseInt(req.query.count) || 5;

    // If the note already has a pre-generated quiz with questions matching, we can return or regenerate
    if (note.quiz && Array.isArray(note.quiz) && note.quiz.length >= count && !req.query.fresh) {
      return res.json({
        success: true,
        topic: note,
        questions: note.quiz.slice(0, count),
        notes: [{ id: note.id, title: note.title, subject: note.subject }]
      });
    }

    const questions = await generateQuizFromNotes([note], difficulty, count);
    res.json({
      success: true,
      topic: note,
      questions,
      notes: [{ id: note.id, title: note.title, subject: note.subject }],
      count: questions.length,
      difficulty
    });
  } catch (error) {
    console.error(`[API GET /api/quiz/${req.params.noteId}] Error:`, error);
    res.status(500).json({ error: 'Failed to generate quiz for note', details: error.message });
  }
});

/**
 * Record a completed quiz attempt handler
 */
async function handleRecordAttempt(req, res) {
  try {
    const attempt = req.body;
    if (!attempt || attempt.score === undefined || (!attempt.topicId && !attempt.topicTitle)) {
      return res.status(400).json({ error: 'Valid attempt data with topicId and score is required' });
    }

    const userId = req.body.userId || req.headers['x-user-id'] || null;
    if (userId && !attempt.userId) {
      attempt.userId = userId;
    }

    const saved = await saveQuizAttempt(attempt);
    res.status(201).json(saved);
  } catch (error) {
    console.error('[API POST /api/quiz/attempt] Error:', error);
    res.status(500).json({ error: 'Failed to record quiz attempt', details: error.message });
  }
}

/**
 * POST /api/quiz/attempt
 * Saves a completed quiz result into SQLite and updates topic mastery score
 */
router.post('/attempt', handleRecordAttempt);

/**
 * POST /api/quiz-attempts
 * Alias for client compatibility
 */
router.post('/attempts', handleRecordAttempt);

export default router;
