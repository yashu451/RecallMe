import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import HomeDashboard from './components/dashboard/HomeDashboard';
import CreateView from './components/create/CreateView';
import StudyMaterialView from './components/study/StudyMaterialView';
import RecallQuizView from './components/quiz/RecallQuizView';
import QuizResultsView from './components/quiz/QuizResultsView';
import LibraryView from './components/library/LibraryView';
import QuizHistoryView from './components/quiz/QuizHistoryView';

import { INITIAL_TOPICS, INITIAL_QUIZ_HISTORY } from './data/mockData';
import { generateStudyMaterialFromText } from './utils/studyGenerator';
import { 
  generateStudyMaterial, 
  fetchTopics, 
  toggleTopicStarBackend, 
  deleteTopicBackend, 
  fetchQuizHistory, 
  recordQuizAttempt 
} from './services/api';

import AmbientBackground from './components/common/AmbientBackground';

// Wrapper to find topic by ID for Study view
function StudyRouteWrapper({ topics, onStartQuiz, onToggleStar }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const topic = topics.find(t => t.id === id) || topics[0];

  return (
    <StudyMaterialView 
      topic={topic}
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
  const topic = topics.find(t => t.id === id) || topics[0];

  return (
    <RecallQuizView 
      topic={topic}
      onCompleteQuiz={onCompleteQuiz}
      onExitQuiz={() => navigate(`/study/${topic?.id || ''}`)}
    />
  );
}

// Protected Route helper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signup" replace />;
}

export default function App() {
  const [topics, setTopics] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [latestQuizResult, setLatestQuizResult] = useState(null);
  const [quickInputDraft, setQuickInputDraft] = useState('');

  // Fetch live data from backend SQLite on mount
  useEffect(() => {
    async function loadBackendData() {
      const backendTopics = await fetchTopics();
      if (backendTopics && backendTopics.length > 0) {
        setTopics(backendTopics);
        setActiveTopicId(backendTopics[0].id);
      } else {
        setTopics([]);
        setActiveTopicId(null);
      }

      const backendHistory = await fetchQuizHistory();
      if (backendHistory && backendHistory.length > 0) {
        setQuizHistory(backendHistory);
      } else {
        setQuizHistory([]);
      }
    }
    loadBackendData();
  }, []);

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

    // Add to quiz history
    const historyEntry = {
      id: 'hist-' + Date.now(),
      topicId: result.topicId,
      topicTitle: result.topicTitle,
      subject: result.subject,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      timeTaken: result.timeTaken,
      date: result.date,
      feedback: result.percentage >= 80 
        ? 'High retention score achieved. Core invariants well grasped.'
        : 'Review suggested on highlighted questions.'
    };
    setQuizHistory(prev => [historyEntry, ...prev]);

    // Persist to backend SQLite
    await recordQuizAttempt(historyEntry);
  };

  const handleGenerate = async (rawText, userTitle, options, subject) => {
    const newTopic = await generateStudyMaterial(rawText, userTitle, subject, options);
    setTopics(prev => [newTopic, ...prev]);
    setActiveTopicId(newTopic.id);
    setQuickInputDraft('');
    return newTopic;
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
    <AuthProvider>
      <BrowserRouter>
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
                      onGenerate={async (rawText, title, options, subject) => {
                        const created = await handleGenerate(rawText, title, options, subject);
                        window.location.href = `/study/${created.id}`;
                      }}
                      onCancel={() => window.location.href = '/dashboard'}
                    />
                  </ProtectedRoute>
                } 
              />

              {/* Study Material View */}
              <Route 
                path="/study/:id" 
                element={
                  <ProtectedRoute>
                    <StudyRouteWrapper 
                      topics={topics}
                      onStartQuiz={handleStartQuiz}
                      onToggleStar={handleToggleStar}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/study" 
                element={<Navigate to={activeTopic ? `/study/${activeTopic.id}` : '/dashboard'} replace />} 
              />

              {/* Active Recall Quiz */}
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
      </BrowserRouter>
    </AuthProvider>
  );
}
