import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db.js';
import generateRoutes from './routes/generate.js';
import topicsRoutes from './routes/topics.js';
import quizRoutes from './routes/quiz.js';
import authRoutes from './routes/auth.js';
import { INITIAL_TOPICS, INITIAL_QUIZ_HISTORY } from '../src/data/mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend applications (Vite default is 5173)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with generous limit for full lectures & PDFs
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
  );

  res.json({
    status: 'ok',
    service: 'RecallMe AI Backend',
    database: 'SQLite',
    aiEngine: hasGemini ? 'Google Gemini 2.5 Flash' : 'Local Cognitive Synthesis (Add GEMINI_API_KEY for live AI)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/quiz', quizRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize SQLite & start server
async function startServer() {
  try {
    console.log('[RecallMe Backend] Initializing SQLite database (clean user mode)...');
    await initDatabase([], []);
    console.log('[RecallMe Backend] SQLite database ready.');

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  RecallMe Backend Server is RUNNING!`);
      console.log(`  Port:      http://localhost:${PORT}`);
      console.log(`  Health:    http://localhost:${PORT}/api/health`);
      console.log(`  Endpoints: POST /api/generate`);
      console.log(`             GET/POST/DELETE /api/topics`);
      console.log(`             GET/POST /api/quiz/history`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
