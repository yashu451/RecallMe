import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure database directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'recallme.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Helper for promise-based queries
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize tables
export async function initDatabase(initialTopics = [], initialHistory = []) {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT,
      subject_code TEXT,
      read_time TEXT,
      created_at TEXT,
      last_studied TEXT,
      mastery_score INTEGER DEFAULT 0,
      is_starred INTEGER DEFAULT 0,
      tags TEXT,
      summary TEXT,
      source_excerpt TEXT,
      sections TEXT,
      takeaways TEXT,
      keywords TEXT,
      definitions TEXT,
      quiz TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      topic_id TEXT,
      topic_title TEXT,
      subject TEXT,
      score INTEGER,
      total_questions INTEGER,
      percentage INTEGER,
      time_taken TEXT,
      date TEXT,
      feedback TEXT,
      review_details TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      streak INTEGER DEFAULT 0,
      joined_date TEXT
    )
  `);

  // Clean database initialized for user
  console.log('[SQLite] Ready with user tables.');
}

// User CRUD operations
export async function findUserByEmail(email) {
  if (!email) return null;
  const row = await dbGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    avatar: row.avatar,
    streak: row.streak,
    joinedDate: row.joined_date
  };
}

export async function createUser({ name, email, password }) {
  const id = 'user-' + Date.now();
  const avatar = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';
  const joinedDate = 'Today';

  await dbRun(
    'INSERT INTO users (id, name, email, password, avatar, streak, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, name.trim(), email.trim().toLowerCase(), password, avatar, 0, joinedDate]
  );

  return {
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    avatar,
    streak: 0,
    dailyGoal: 3,
    joinedDate,
    retentionAverage: 0,
    notifications: true,
    spacedInterval: '48h'
  };
}

// Data conversion helpers
export function serializeTopic(topic) {
  return [
    topic.id,
    topic.title || 'Untitled',
    topic.subject || 'General',
    topic.subjectCode || '',
    topic.readTime || '3 min read',
    topic.createdAt || new Date().toISOString().split('T')[0],
    topic.lastStudied || 'Never',
    topic.masteryScore || 0,
    topic.isStarred ? 1 : 0,
    JSON.stringify(topic.tags || []),
    topic.summary || '',
    topic.sourceExcerpt || '',
    JSON.stringify(topic.sections || []),
    JSON.stringify(topic.takeaways || []),
    JSON.stringify(topic.keywords || []),
    JSON.stringify(topic.definitions || []),
    JSON.stringify(topic.quiz || [])
  ];
}

export function deserializeTopic(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    subjectCode: row.subject_code,
    readTime: row.read_time,
    createdAt: row.created_at,
    lastStudied: row.last_studied,
    masteryScore: row.mastery_score,
    isStarred: Boolean(row.is_starred),
    tags: JSON.parse(row.tags || '[]'),
    summary: row.summary,
    sourceExcerpt: row.source_excerpt,
    sections: JSON.parse(row.sections || '[]'),
    takeaways: JSON.parse(row.takeaways || '[]'),
    keywords: JSON.parse(row.keywords || '[]'),
    definitions: JSON.parse(row.definitions || '[]'),
    quiz: JSON.parse(row.quiz || '[]')
  };
}

export async function getAllTopics() {
  const rows = await dbAll('SELECT * FROM topics ORDER BY rowid DESC');
  return rows.map(deserializeTopic);
}

export async function getTopicById(id) {
  const row = await dbGet('SELECT * FROM topics WHERE id = ?', [id]);
  return deserializeTopic(row);
}

export async function saveTopic(topic) {
  const sql = `
    INSERT OR REPLACE INTO topics (
      id, title, subject, subject_code, read_time, created_at,
      last_studied, mastery_score, is_starred, tags, summary,
      source_excerpt, sections, takeaways, keywords, definitions, quiz
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await dbRun(sql, serializeTopic(topic));
  return getTopicById(topic.id);
}

export async function toggleTopicStar(id) {
  const topic = await getTopicById(id);
  if (!topic) return null;
  const newStar = topic.isStarred ? 0 : 1;
  await dbRun('UPDATE topics SET is_starred = ? WHERE id = ?', [newStar, id]);
  return getTopicById(id);
}

export async function updateTopicMastery(id, score) {
  await dbRun(
    'UPDATE topics SET mastery_score = ?, last_studied = ? WHERE id = ?',
    [score, 'Just now', id]
  );
  return getTopicById(id);
}

export async function deleteTopic(id) {
  await dbRun('DELETE FROM topics WHERE id = ?', [id]);
  return { success: true };
}

export async function getAllQuizHistory() {
  const rows = await dbAll('SELECT * FROM quiz_attempts ORDER BY rowid DESC');
  return rows.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    topicTitle: r.topic_title,
    subject: r.subject,
    score: r.score,
    totalQuestions: r.total_questions,
    percentage: r.percentage,
    timeTaken: r.time_taken,
    date: r.date,
    feedback: r.feedback,
    reviewDetails: r.review_details ? JSON.parse(r.review_details) : null
  }));
}

export async function saveQuizAttempt(attempt) {
  const sql = `
    INSERT OR REPLACE INTO quiz_attempts (
      id, topic_id, topic_title, subject, score, total_questions,
      percentage, time_taken, date, feedback, review_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await dbRun(sql, [
    attempt.id || ('hist-' + Date.now()),
    attempt.topicId,
    attempt.topicTitle,
    attempt.subject,
    attempt.score,
    attempt.totalQuestions,
    attempt.percentage,
    attempt.timeTaken,
    attempt.date || new Date().toISOString().split('T')[0],
    attempt.feedback || '',
    JSON.stringify(attempt.reviewDetails || [])
  ]);

  // Also update topic mastery score if topic exists
  if (attempt.topicId && attempt.percentage !== undefined) {
    await updateTopicMastery(attempt.topicId, attempt.percentage);
  }

  return attempt;
}

export default db;
