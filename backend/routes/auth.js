import express from 'express';
import { findUserByEmail, createUser } from '../database/db.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user. If user already exists, reject with error.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please log in.'
      });
    }

    const user = await createUser({ name, email, password });
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        streak: user.streak,
        dailyGoal: user.dailyGoal,
        joinedDate: user.joinedDate,
        retentionAverage: user.retentionAverage,
        notifications: user.notifications,
        spacedInterval: user.spacedInterval
      }
    });
  } catch (err) {
    console.error('[API /api/auth/signup] Error:', err);
    res.status(500).json({ error: 'Failed to create account', details: err.message });
  }
});

/**
 * POST /api/auth/login
 * Log in an existing user.
 * Rejects if user has NOT signed up first!
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const existing = await findUserByEmail(email);
    if (!existing) {
      return res.status(404).json({
        error: 'No account found with this email. Please sign up first!'
      });
    }

    if (existing.password !== password) {
      return res.status(401).json({
        error: 'Incorrect password. Please verify your credentials.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        avatar: existing.avatar,
        streak: existing.streak || 0,
        dailyGoal: 3,
        joinedDate: existing.joinedDate || 'Today',
        retentionAverage: 0,
        notifications: true,
        spacedInterval: '48h'
      }
    });
  } catch (err) {
    console.error('[API /api/auth/login] Error:', err);
    res.status(500).json({ error: 'Failed to log in', details: err.message });
  }
});

export default router;
