/**
 * Quiz Service for RecallMe
 * Generates and evaluates quizzes strictly grounded in the user's saved study materials.
 * 
 * Never generates generic, unrelated questions (no Arrays, React, SQL, etc.)
 * Always requires saved study notes as the foundation.
 */

import { generateQuizFromNotesApi, recordQuizAttempt } from './api';
import { generateGroundedQuestionsFromNotes } from '../utils/groundedQuizGenerator';

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

/**
 * Fetch practice quiz questions strictly based on selected saved notes.
 * 
 * @param {object} params
 *   - noteIds: string[]
 *   - notes: Array of full note objects
 *   - noteId: string (for single note shortcut)
 *   - difficulty: 'Easy' | 'Medium' | 'Hard'
 *   - count: number (5, 10, or 15)
 * @returns {Promise<object>}
 */
export async function fetchQuiz(params = {}) {
  const config = typeof params === 'string' ? { noteId: params } : params;
  const { 
    noteIds = [], 
    notes = [], 
    noteId = null, 
    difficulty = 'Medium', 
    count = 5 
  } = config;

  const resolvedNoteIds = Array.isArray(noteIds) && noteIds.length > 0 
    ? noteIds 
    : (noteId ? [noteId] : []);

  // Determine active note objects if available
  let resolvedNotes = Array.isArray(notes) ? [...notes] : [];

  // 1. Try Backend Live API first
  try {
    const apiResult = await generateQuizFromNotesApi({
      noteIds: resolvedNoteIds,
      notes: resolvedNotes.length > 0 ? resolvedNotes : undefined,
      difficulty,
      count
    });

    if (apiResult && Array.isArray(apiResult.questions) && apiResult.questions.length > 0) {
      const displayTitle = apiResult.notes?.length > 1
        ? `${apiResult.notes.length} Study Notes (${apiResult.notes.map(n => n.title).slice(0, 2).join(', ')}${apiResult.notes.length > 2 ? '...' : ''})`
        : (apiResult.notes?.[0]?.title || (resolvedNotes[0]?.title) || 'Study Notes Recall');

      const displaySubject = apiResult.notes?.[0]?.subject || resolvedNotes[0]?.subject || 'Study Deck';

      return {
        noteId: resolvedNoteIds.join(',') || 'custom-deck',
        topic: displayTitle,
        subject: displaySubject,
        difficulty: apiResult.difficulty || difficulty,
        questions: apiResult.questions,
        notes: apiResult.notes || resolvedNotes,
        isMock: false,
        source: 'backend-gemini'
      };
    }
  } catch (backendError) {
    console.warn('[QuizService] Backend quiz generation failed or server offline:', backendError.message);

    // 2. Client-side grounded generation strictly from notes in memory
    if (resolvedNotes.length > 0) {
      try {
        const questions = generateGroundedQuestionsFromNotes(resolvedNotes, difficulty, count);
        const displayTitle = resolvedNotes.length > 1
          ? `${resolvedNotes.length} Study Notes (${resolvedNotes.map(n => n.title).slice(0, 2).join(', ')}${resolvedNotes.length > 2 ? '...' : ''})`
          : (resolvedNotes[0]?.title || 'Study Notes Recall');

        return {
          noteId: resolvedNoteIds.join(',') || 'custom-deck',
          topic: displayTitle,
          subject: resolvedNotes[0]?.subject || 'Study Deck',
          difficulty,
          questions,
          notes: resolvedNotes,
          isMock: false,
          source: 'local-grounded'
        };
      } catch (genErr) {
        throw new Error(
          `Unable to generate quiz questions from your selected notes: ${genErr.message}`
        );
      }
    }

    // If no note content exists and backend is unreachable, throw an informative error
    // (Never silently show generic Arrays or SQL questions!)
    throw new Error(
      `Could not generate practice quiz: ${backendError.message || 'Backend unreachable and no local note content supplied'}. Please select your saved notes to practice.`
    );
  }

  throw new Error('Please select at least one study note from your library to generate a practice quiz.');
}

/**
 * Submit quiz answers and calculate results
 */
export async function submitQuizAttempt({ noteId, topic, subject, difficulty, answers, questions }) {
  const totalQuestions = questions.length;
  let localScore = 0;

  const answersMap = {};
  (answers || []).forEach(a => {
    answersMap[a.questionId] = a.selectedAnswer;
  });

  const reviewDetails = questions.map((q, idx) => {
    const selected = answersMap[q.id];
    const expected = q.correctAnswer !== undefined 
      ? q.correctAnswer 
      : (q.correctIndex !== undefined ? q.options?.[q.correctIndex] : null);

    const isCorrect = selected !== undefined && selected === expected;
    if (isCorrect) localScore += 1;

    return {
      questionId: q.id || `q-${idx}`,
      question: q.question,
      options: q.options || [],
      selectedAnswer: selected || null,
      correctAnswer: expected,
      isCorrect,
      explanation: q.explanation || '',
      sourceNoteTitle: q.sourceNoteTitle || topic || 'Study Note'
    };
  });

  const calculatedPercentage = totalQuestions > 0 ? Math.round((localScore / totalQuestions) * 100) : 0;

  const attemptData = {
    id: 'attempt-' + Date.now(),
    topicId: String(noteId || 'notes-quiz'),
    topicTitle: topic || 'Study Notes Practice Quiz',
    subject: subject || 'General',
    score: localScore,
    totalQuestions: totalQuestions,
    percentage: calculatedPercentage,
    difficulty: difficulty || 'Medium',
    reviewDetails: reviewDetails
  };

  try {
    await recordQuizAttempt(attemptData);
  } catch (err) {
    console.warn('[QuizService] Failed to record attempt in backend:', err.message);
  }

  return {
    success: true,
    score: localScore,
    totalQuestions,
    percentage: calculatedPercentage,
    reviewDetails
  };
}
