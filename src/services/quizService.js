/**
 * Quiz Service for RecallMe
 * Handles communication with the backend API or mock data fallback.
 * 
 * Endpoints:
 * GET  /api/quiz/:noteId
 * GET  /api/quiz?domain=...&topic=...&difficulty=...&count=...
 * POST /api/quiz-attempts
 */

import { getFilteredQuestions, ALL_QUESTIONS } from '../data/mockQuizData';
import { getMockQuiz } from '../data/mockQuiz';

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

let sessionMockOverride = null;

export function getIsMockMode() {
  if (sessionMockOverride !== null) return sessionMockOverride;
  if (import.meta.env.VITE_USE_MOCK === 'true') return true;
  if (!API_BASE_URL) return true;
  return false;
}

export function setIsMockMode(useMock) {
  sessionMockOverride = Boolean(useMock);
}

/**
 * Fetch quiz questions either by noteId OR by hub parameters (domain, topic, difficulty, count)
 * 
 * @param {object} params { noteId, domain, topic, difficulty, count }
 * @returns {Promise<object>}
 */
export async function fetchQuiz(params = {}) {
  // Normalize params if string noteId was passed directly
  const config = typeof params === 'string' ? { noteId: params } : params;
  const { noteId, domain, topic, difficulty = 'Medium', count = 5 } = config;

  const isMock = getIsMockMode();

  // If in mock mode or no backend URL configured
  if (isMock) {
    await new Promise(res => setTimeout(res, 250));

    if (noteId) {
      const noteQuiz = getMockQuiz(noteId);
      return {
        ...noteQuiz,
        isMock: true,
        source: 'mock'
      };
    }

    const questions = getFilteredQuestions({ domain, topic, difficulty, count });
    return {
      noteId: `${domain || 'general'}-${topic || 'practice'}`.toLowerCase().replace(/\s+/g, '-'),
      topic: topic ? `${domain} — ${topic}` : (domain || 'Practice Quiz'),
      domain: domain || 'General Computer Science',
      difficulty: difficulty,
      questions: questions,
      isMock: true,
      source: 'mock'
    };
  }

  // Attempt real API call to backend
  let endpoint = '';
  if (noteId) {
    endpoint = `${API_BASE_URL}/api/quiz/${encodeURIComponent(noteId)}`;
  } else {
    const query = new URLSearchParams({
      domain: domain || '',
      topic: topic || '',
      difficulty: difficulty || '',
      count: String(count || 5)
    }).toString();
    endpoint = `${API_BASE_URL}/api/quiz?${query}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend responded with HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      throw new Error('Invalid quiz response structure received from backend.');
    }

    return {
      noteId: String(data.noteId || noteId || 'custom-quiz'),
      topic: data.topic || topic || 'Practice Quiz',
      domain: data.domain || domain || 'Computer Science',
      difficulty: data.difficulty || difficulty,
      questions: data.questions,
      isMock: false,
      source: 'backend'
    };
  } catch (err) {
    console.warn(`[QuizService] GET ${endpoint} failed:`, err.message);

    // Provide fallback mock questions so user is never stuck
    const fallbackQuestions = noteId 
      ? getMockQuiz(noteId).questions 
      : getFilteredQuestions({ domain, topic, difficulty, count });

    return {
      noteId: String(noteId || `${domain}-${topic}`),
      topic: topic ? `${domain} — ${topic}` : (domain || 'Practice Quiz'),
      domain: domain || 'Computer Science',
      difficulty: difficulty,
      questions: fallbackQuestions,
      isMock: true,
      source: 'mock-fallback',
      fallbackNotice: `Backend server at ${API_BASE_URL || 'port'} was unreachable. Loaded mock practice questions.`
    };
  }
}

/**
 * Submit quiz answers to the backend
 * 
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function submitQuizAttempt({ noteId, domain, topic, difficulty, answers, questions }) {
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
      explanation: q.explanation || ''
    };
  });

  const calculatedPercentage = totalQuestions > 0 ? Math.round((localScore / totalQuestions) * 100) : 0;

  const requestPayload = {
    noteId: String(noteId || 'practice-hub'),
    domain: domain || '',
    topic: topic || '',
    difficulty: difficulty || '',
    answers: answers.map(a => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer
    })),
    score: localScore,
    totalQuestions: totalQuestions
  };

  const isMock = getIsMockMode();

  if (isMock) {
    await new Promise(res => setTimeout(res, 200));
    return {
      success: true,
      savedToServer: false,
      isMock: true,
      score: localScore,
      totalQuestions,
      percentage: calculatedPercentage,
      reviewDetails,
      serverMessage: 'Working in offline mock mode. Results evaluated locally.'
    };
  }

  const endpoint = `${API_BASE_URL}/api/quiz-attempts`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend returned HTTP ${response.status}: ${response.statusText}`);
    }

    const serverData = await response.json();

    const finalScore = typeof serverData?.score === 'number' ? serverData.score : localScore;
    const finalTotal = typeof serverData?.totalQuestions === 'number' ? serverData.totalQuestions : totalQuestions;
    const finalPercentage = finalTotal > 0 ? Math.round((finalScore / finalTotal) * 100) : calculatedPercentage;

    return {
      success: true,
      savedToServer: true,
      isMock: false,
      score: finalScore,
      totalQuestions: finalTotal,
      percentage: finalPercentage,
      reviewDetails,
      serverData,
      serverMessage: 'Attempt successfully recorded on server.'
    };
  } catch (err) {
    console.warn(`[QuizService] POST ${endpoint} failed:`, err.message);

    return {
      success: true,
      savedToServer: false,
      isMock: false,
      score: localScore,
      totalQuestions,
      percentage: calculatedPercentage,
      reviewDetails,
      serverError: err.message,
      serverMessage: `Backend sync failed: ${err.message}`
    };
  }
}
