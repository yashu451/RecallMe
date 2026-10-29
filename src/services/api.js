/**
 * RecallMe Frontend API Service
 * Communicates with the Express + SQLite + Gemini backend (http://localhost:5000).
 * Falls back gracefully to local processing if the backend server is offline.
 */

const API_BASE_URL = 'http://localhost:5000/api';

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
  try {
    const res = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        title,
        subject,
        options,
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
  try {
    const res = await fetch(`${API_BASE_URL}/topics`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not fetch topics from backend, using local state.');
  }
  return null;
}

export async function persistTopic(topic) {
  try {
    const res = await fetch(`${API_BASE_URL}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topic),
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
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/history`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not fetch quiz history from backend, using local state.');
  }
  return null;
}

export async function recordQuizAttempt(attempt) {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt),
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
