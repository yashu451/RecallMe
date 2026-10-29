/**
 * RecallMe Frontend API Service
 * Communicates with the Express + SQLite + Gemini backend (http://localhost:5000).
 * Connects seamlessly via Vite's proxy (/api) with direct fallback to port 5000.
 */

const DIRECT_API_URL = 'http://localhost:5000/api';
const PROXY_API_URL = '/api';

/**
 * Resolves the primary API base URL.
 * In a browser under Vite dev server, relative '/api' utilizes Vite's proxy,
 * eliminating CORS, preflight overhead, and localhost vs 127.0.0.1 discrepancies.
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return PROXY_API_URL;
  }
  return DIRECT_API_URL;
}

/**
 * Resilient API fetcher:
 * 1. Attempts request via Vite proxy (/api)
 * 2. If proxy fails or direct port is preferred, falls back to http://localhost:5000/api
 * 3. If backend is completely unreachable, throws a descriptive error explaining that the
 *    backend server on port 5000 is offline.
 */
export async function backendFetch(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const primaryBase = getApiBaseUrl();
  const primaryUrl = `${primaryBase}/${cleanPath}`;

  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (err) {
    // If the proxied request failed due to a network connection error (e.g. Failed to fetch),
    // try the direct URL to port 5000
    if (primaryBase !== DIRECT_API_URL) {
      try {
        const directUrl = `${DIRECT_API_URL}/${cleanPath}`;
        return await fetch(directUrl, options);
      } catch {
        throw new Error('RecallMe backend server is not running on port 5000. Please start it using start-backend.bat or npm run backend, then retry.');
      }
    }
    throw new Error('RecallMe backend server is not running on port 5000. Please start it using start-backend.bat or npm run backend, then retry.');
  }
}

function getActiveUserId() {
  try {
    const userStr = localStorage.getItem('recallme_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function apiSignup(name, email, password) {
  try {
    const res = await backendFetch('auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      signal: AbortSignal.timeout(4000)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to sign up' };
    }
    return { success: true, user: data.user };
  } catch {
    return { success: false, error: 'Backend unreachable', offline: true };
  }
}

export async function apiLogin(email, password) {
  try {
    const res = await backendFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(4000)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    return { success: true, user: data.user };
  } catch {
    return { success: false, error: 'Backend unreachable', offline: true };
  }
}

export async function checkBackendHealth() {
  try {
    const res = await backendFetch('health', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // backend offline
  }
  return null;
}

/**
 * Generate study materials without auto-saving to SQLite database.
 * Notes are saved to SQLite only when the user explicitly clicks "Save to My Library".
 */
export async function generateStudyMaterial(text, title = '', subject = '', options = {}) {
  const userId = getActiveUserId();
  const saveToDb = Boolean(options && options.saveToDb);

  try {
    const res = await backendFetch('generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({
        text,
        title,
        subject,
        options,
        userId,
        saveToDb
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (res.ok) {
      return await res.json();
    }
    console.warn('[API] Backend error generating material, falling back to local generator');
  } catch (err) {
    console.warn('[API] Backend unreachable, falling back to local generator:', err.message);
  }

  // Graceful fallback to client-side generator if backend is offline
  const { generateStudyMaterialFromText } = await import('../utils/studyGenerator');
  const generated = generateStudyMaterialFromText(text, title, options);
  if (subject) generated.subject = subject;
  return generated;
}

export async function fetchTopics() {
  const userId = getActiveUserId();
  try {
    const path = userId ? `topics?userId=${encodeURIComponent(userId)}` : 'topics';
    const res = await backendFetch(path, { 
      headers: userId ? { 'x-user-id': userId } : {},
      signal: AbortSignal.timeout(4000) 
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not fetch topics from backend:', err.message);
  }
  return [];
}

export async function fetchTopicById(id) {
  try {
    const res = await backendFetch(`topics/${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] Could not fetch topic ${id} from backend:`, err.message);
  }
  return null;
}

export async function persistTopic(topic) {
  const userId = getActiveUserId();
  const res = await backendFetch('topics', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {})
    },
    body: JSON.stringify({ ...topic, userId: topic.userId || userId }),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to save study notes to backend database.');
  }

  return await res.json();
}

export async function toggleTopicStarBackend(topicId) {
  try {
    const res = await backendFetch(`topics/${topicId}/star`, {
      method: 'PUT',
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not toggle star in backend:', err.message);
  }
  return null;
}

export async function deleteTopicBackend(topicId) {
  try {
    const res = await backendFetch(`topics/${topicId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not delete topic in backend:', err.message);
  }
  return null;
}

export async function fetchQuizHistory() {
  const userId = getActiveUserId();
  try {
    const path = userId ? `quiz/history?userId=${encodeURIComponent(userId)}` : 'quiz/history';
    const res = await backendFetch(path, { 
      headers: userId ? { 'x-user-id': userId } : {},
      signal: AbortSignal.timeout(4000) 
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn('[API] Could not fetch quiz history from backend, using local state.');
  }
  return [];
}

export async function recordQuizAttempt(attempt) {
  const userId = getActiveUserId();
  try {
    const res = await backendFetch('quiz/attempt', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ ...attempt, userId: attempt.userId || userId }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not save quiz attempt in backend:', err.message);
  }
  return attempt;
}

/**
 * Generate quiz questions strictly from selected study notes
 */
export async function generateQuizFromNotesApi({ noteIds = [], notes = [], difficulty = 'Medium', count = 5 }) {
  const userId = getActiveUserId();
  const res = await backendFetch('quiz/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {})
    },
    body: JSON.stringify({
      noteIds,
      notes,
      difficulty,
      count,
      userId
    }),
    signal: AbortSignal.timeout(30000)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate quiz from selected study notes');
  }
  return data;
}
