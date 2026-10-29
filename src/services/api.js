/**
 * RecallMe Frontend API Service
 * Communicates with the Express + SQLite + Gemini backend (http://localhost:5000).
 * Falls back gracefully to local processing if the backend server is offline.
 */

const API_BASE_URL = 'http://localhost:5000/api';

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
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
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
  } catch (err) {
    return { success: false, error: 'Backend unreachable', offline: true };
  }
}

export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
  } catch (err) {
    return { success: false, error: 'Backend unreachable', offline: true };
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // backend offline
  }
  return null;
}

export async function generateStudyMaterial(text, title = '', subject = 'General Science', options = {}) {
  const userId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/generate`, {
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
        saveToDb: true
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

  // Graceful fallback to client-side generator
  const { generateStudyMaterialFromText } = await import('../utils/studyGenerator');
  return generateStudyMaterialFromText(text, title, options);
}

export async function fetchTopics() {
  const userId = getActiveUserId();
  try {
    const url = userId ? `${API_BASE_URL}/topics?userId=${encodeURIComponent(userId)}` : `${API_BASE_URL}/topics`;
    const res = await fetch(url, { 
      headers: userId ? { 'x-user-id': userId } : {},
      signal: AbortSignal.timeout(3000) 
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not fetch topics from backend, using local state.');
  }
  return null;
}

export async function persistTopic(topic) {
  const userId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/topics`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ ...topic, userId: topic.userId || userId }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not save topic to backend SQLite:', err.message);
  }
  return topic;
}

export async function toggleTopicStarBackend(topicId) {
  try {
    const res = await fetch(`${API_BASE_URL}/topics/${topicId}/star`, {
      method: 'PUT',
      signal: AbortSignal.timeout(3000)
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
    const res = await fetch(`${API_BASE_URL}/topics/${topicId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000)
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
    const url = userId ? `${API_BASE_URL}/quiz/history?userId=${encodeURIComponent(userId)}` : `${API_BASE_URL}/quiz/history`;
    const res = await fetch(url, { 
      headers: userId ? { 'x-user-id': userId } : {},
      signal: AbortSignal.timeout(3000) 
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not fetch quiz history from backend, using local state.');
  }
  return null;
}

export async function recordQuizAttempt(attempt) {
  const userId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/attempt`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ ...attempt, userId: attempt.userId || userId }),
      signal: AbortSignal.timeout(3000)
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
  const res = await fetch(`${API_BASE_URL}/quiz/generate`, {
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
