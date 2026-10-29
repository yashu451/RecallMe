import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import HomeDashboard from './components/dashboard/HomeDashboard';
import CreateView from './components/create/CreateView';
import StudyMaterialView from './components/study/StudyMaterialView';
import QuizHubPage from './pages/QuizHubPage';
import QuizPage from './pages/QuizPage';
import RecallQuizView from './components/quiz/RecallQuizView';
import QuizResultsView from './components/quiz/QuizResultsView';
import LibraryView from './components/library/LibraryView';
import QuizHistoryView from './components/quiz/QuizHistoryView';

import { 
  generateStudyMaterial, 
  fetchTopics, 
  fetchTopicById,
  persistTopic,
  toggleTopicStarBackend, 
  deleteTopicBackend, 
  fetchQuizHistory, 
  recordQuizAttempt 
} from './services/api';

import AmbientBackground from './components/common/AmbientBackground';

// Wrapper to find topic by ID for Study view
function StudyRouteWrapper({ topics, onStartQuiz, onToggleStar, onSaveTopic }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Topic might be passed in location.state (freshly generated note result)
  const stateTopic = location.state?.topic;

  // 2. Topic might be found in saved topics array
  const foundTopic = topics.find(t => t.id === id);

  // 3. Fallback: fetch topic by ID from backend SQLite if refreshed or opened directly
  const [fetchedTopic, setFetchedTopic] = useState(null);
  const [loading, setLoading] = useState(!stateTopic && !foundTopic && Boolean(id));

  useEffect(() => {
    if (stateTopic || foundTopic) {
      setLoading(false);
      return;
    }

    if (id) {
      let isMounted = true;
      setLoading(true);
      fetchTopicById(id)
        .then(t => {
          if (isMounted && t) {
            setFetchedTopic(t);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => { isMounted = false; };
    } else {
      setLoading(false);
    }
  }, [id, stateTopic, foundTopic]);

  const activeTopic = stateTopic || foundTopic || fetchedTopic || null;
  // A note is considered saved ONLY if it exists in the fetched backend topics array
  const isSaved = Boolean(activeTopic && topics.some(t => t.id === activeTopic.id));

  return (
    <StudyMaterialView 
      topic={activeTopic}
      isLoading={loading}
      isSaved={isSaved}
      onSaveToLibrary={onSaveTopic}
      onBack={() => navigate('/library')}
      onStartQuiz={onStartQuiz}
      onToggleStar={onToggleStar}
    />
  );
}

// Wrapper to find topic by ID for Quiz view
function QuizRouteWrapper({ topics, onCompleteQuiz }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const topic = topics.find(t => t.id === id);

  return (
    <QuizPage 
      noteId={id} 
      topic={topic}
      notes={topic ? [topic] : []}
      onCompleteQuiz={onCompleteQuiz}
      onExitQuiz={() => navigate(topic ? `/study/${topic.id}` : '/quiz')}
    />
  );
}

// Protected Route helper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signup" replace />;
}

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [latestQuizResult, setLatestQuizResult] = useState(null);
  const [quickInputDraft, setQuickInputDraft] = useState('');

  // Fetch live data from backend SQLite on mount and when currentUser changes
  useEffect(() => {
    async function loadBackendData() {
      try {
        const backendTopics = await fetchTopics();
        if (Array.isArray(backendTopics)) {
          setTopics(backendTopics);
          if (backendTopics.length > 0) {
            setActiveTopicId(backendTopics[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load topics from backend:', err);
      }

      try {
        const backendHistory = await fetchQuizHistory();
        if (Array.isArray(backendHistory)) {
          setQuizHistory(backendHistory);
        }
      } catch (err) {
        console.error('Failed to load quiz history from backend:', err);
      }
    }
    loadBackendData();
  }, [currentUser?.id, isAuthenticated]);

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0] || null;

  const handleSelectTopic = (topic) => {
    setActiveTopicId(topic.id);
  };

  const handleStartQuiz = (topic) => {
    setActiveTopicId(topic.id);
  };

  const handleCompleteQuiz = async (result) => {
    setLatestQuizResult(result);

    // Update mastery score for topic
    if (result.topicId) {
      setTopics(prev => prev.map(t => {
        if (t.id === result.topicId) {
          return {
            ...t,
            masteryScore: result.percentage,
            lastStudied: 'Just now'
          };
        }
        return t;
      }));
    }

    // Add to quiz history
    const historyEntry = {
      id: 'hist-' + Date.now(),
      topicId: result.topicId,
      topicTitle: result.topicTitle,
      subject: result.subject || 'Study Deck',
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      timeTaken: result.timeTaken,
      date: result.date,
      feedback: result.percentage >= 80 
        ? 'High retention score achieved. Core concepts and definitions well grasped.'
        : 'Review suggested on highlighted questions.'
    };
    setQuizHistory(prev => [historyEntry, ...prev]);

    // Persist to backend SQLite
    await recordQuizAttempt(historyEntry);
  };

  // Generate study material (does NOT auto-save to database)
  const handleGenerate = async (rawText, userTitle = '', options = {}) => {
    const generated = await generateStudyMaterial(rawText, userTitle, '', options);
    setQuickInputDraft('');
    return generated;
  };

  // Save generated topic to My Library (persists to backend SQLite database)
  const handleSaveTopic = async (topicToSave) => {
    const saved = await persistTopic(topicToSave);
    const resolved = saved || topicToSave;
    setTopics(prev => {
      const exists = prev.some(t => t.id === resolved.id);
      if (exists) return prev;
      return [resolved, ...prev];
    });
    setActiveTopicId(resolved.id);
    return resolved;
  };

  const handleToggleStar = async (topicId) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, isStarred: !t.isStarred };
      }
      return t;
    }));
    await toggleTopicStarBackend(topicId);
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm("Remove this study material from your library?")) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
      if (activeTopicId === topicId) {
        const remaining = topics.filter(t => t.id !== topicId);
        if (remaining.length > 0) {
          setActiveTopicId(remaining[0].id);
        }
      }
      await deleteTopicBackend(topicId);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-mainText flex flex-col antialiased font-sans relative">
      {/* Subtle Ambient Background Depth */}
      <AmbientBackground />

      {/* Polished Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 page-enter">
        <Routes>
          {/* Public Marketing / Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Application Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <HomeDashboard 
                  topics={topics}
                  onSelectTopic={handleSelectTopic}
                  onStartQuiz={handleStartQuiz}
                  onCreateFromQuickInput={(text) => setQuickInputDraft(text)}
                  onGenerateNotes={async (rawText) => {
                    const created = await handleGenerate(rawText);
                    return created;
                  }}
                />
              </ProtectedRoute>
            } 
          />

          {/* Create Material */}
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateView 
                  initialText={quickInputDraft}
                  onGenerate={async (rawText, title, options) => {
                    const created = await handleGenerate(rawText, title, options);
                    navigate(`/study/${created.id}`, { state: { topic: created, isNew: true } });
                  }}
                  onCancel={() => navigate('/dashboard')}
                />
              </ProtectedRoute>
            } 
          />

          {/* Dedicated Study Material Results View */}
          <Route 
            path="/study/:id" 
            element={
              <ProtectedRoute>
                <StudyRouteWrapper 
                  topics={topics}
                  onStartQuiz={handleStartQuiz}
                  onToggleStar={handleToggleStar}
                  onSaveTopic={handleSaveTopic}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study" 
            element={<Navigate to={activeTopic ? `/study/${activeTopic.id}` : '/dashboard'} replace />} 
          />

          {/* Active Recall Quiz Hub & Play */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <QuizHubPage savedNotes={topics} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/play" 
            element={
              <ProtectedRoute>
                <QuizPage onCompleteQuiz={handleCompleteQuiz} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:id" 
            element={
              <ProtectedRoute>
                <QuizRouteWrapper 
                  topics={topics}
                  onCompleteQuiz={handleCompleteQuiz}
                />
              </ProtectedRoute>
            } 
          />

          {/* Quiz Results */}
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <QuizResultsView 
                  result={latestQuizResult}
                  onRetryQuiz={() => {}}
                  onReviewNotes={() => {}}
                />
              </ProtectedRoute>
            } 
          />

          {/* My Library */}
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <LibraryView 
                  topics={topics}
                  onSelectTopic={handleSelectTopic}
                  onStartQuiz={handleStartQuiz}
                  onToggleStar={handleToggleStar}
                  onDeleteTopic={handleDeleteTopic}
                />
              </ProtectedRoute>
            } 
          />

          {/* Quiz History */}
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <QuizHistoryView 
                  quizHistory={quizHistory}
                  onRetakeTopic={(id) => setActiveTopicId(id)}
                  onReviewTopic={(id) => setActiveTopicId(id)}
                />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
