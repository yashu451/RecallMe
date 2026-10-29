import express from 'express';
import {
  getAllTopics,
  getTopicById,
  saveTopic,
  toggleTopicStar,
  deleteTopic
} from '../database/db.js';

const router = express.Router();

/**
 * GET /api/topics
 * Returns all saved topics from SQLite
 */
router.get('/', async (req, res) => {
  try {
    const topics = await getAllTopics();
    res.json(topics);
  } catch (error) {
    console.error('[API GET /api/topics] Error:', error);
    res.status(500).json({ error: 'Failed to retrieve topics', details: error.message });
  }
});

/**
 * GET /api/topics/:id
 * Returns a specific topic
 */
router.get('/:id', async (req, res) => {
  try {
    const topic = await getTopicById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error(`[API GET /api/topics/${req.params.id}] Error:`, error);
    res.status(500).json({ error: 'Failed to retrieve topic', details: error.message });
  }
});

/**
 * POST /api/topics
 * Saves or updates a topic in SQLite
 */
router.post('/', async (req, res) => {
  try {
    const topicData = req.body;
    if (!topicData || !topicData.id || !topicData.title) {
      return res.status(400).json({ error: 'Valid topic with id and title is required' });
    }
    const saved = await saveTopic(topicData);
    res.status(201).json(saved);
  } catch (error) {
    console.error('[API POST /api/topics] Error:', error);
    res.status(500).json({ error: 'Failed to save topic', details: error.message });
  }
});

/**
 * PUT /api/topics/:id/star
 * Toggles the starred status of a topic
 */
router.put('/:id/star', async (req, res) => {
  try {
    const updated = await toggleTopicStar(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error(`[API PUT /api/topics/${req.params.id}/star] Error:`, error);
    res.status(500).json({ error: 'Failed to toggle star', details: error.message });
  }
});

/**
 * DELETE /api/topics/:id
 * Deletes a topic from SQLite
 */
router.delete('/:id', async (req, res) => {
  try {
    await deleteTopic(req.params.id);
    res.json({ success: true, message: 'Topic deleted successfully' });
  } catch (error) {
    console.error(`[API DELETE /api/topics/${req.params.id}] Error:`, error);
    res.status(500).json({ error: 'Failed to delete topic', details: error.message });
  }
});

export default router;
