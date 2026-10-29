import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import HomeDashboard from './components/dashboard/HomeDashboard';
import CreateView from './components/create/CreateView';
import StudyMaterialView from './components/study/StudyMaterialView';
import RecallQuizView from './components/quiz/RecallQuizView';
import QuizResultsView from './components/quiz/QuizResultsView';
import LibraryView from './components/library/LibraryView';
import QuizHistoryView from './components/quiz/QuizHistoryView';

import { INITIAL_TOPICS, INITIAL_QUIZ_HISTORY } from './data/mockData';
import { generateStudyMaterialFromText } from './utils/studyGenerator';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'create' | 'study' | 'quiz' | 'results' | 'library' | 'history'
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [activeTopicId, setActiveTopicId] = useState(INITIAL_TOPICS[0].id);
  const [quizHistory, setQuizHistory] = useState(INITIAL_QUIZ_HISTORY);
  const [latestQuizResult, setLatestQuizResult] = useState(null);
  const [initialCreateText, setInitialCreateText] = useState('');

  // Active topic object
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  // Actions
  const handleSelectTopic = (topic) => {
    setActiveTopicId(topic.id);
    setCurrentView('study');
  };

  const handleStartQuiz = (topic) => {
    setActiveTopicId(topic.id);
    setCurrentView('quiz');
  };

  const handleCompleteQuiz = (result) => {
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

    // Add to history
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

    setCurrentView('results');
  };

  const handleGenerate = (rawText, userTitle, options) => {
    const newTopic = generateStudyMaterialFromText(rawText, userTitle, options);
    setTopics(prev => [newTopic, ...prev]);
    setActiveTopicId(newTopic.id);
    setInitialCreateText('');
    setCurrentView('study');
  };

  const handleCreateFromQuickInput = (text) => {
    setInitialCreateText(text);
    setCurrentView('create');
  };

  const handleToggleStar = (topicId) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, isStarred: !t.isStarred };
      }
      return t;
    }));
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Remove this study material from your library?")) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
      if (activeTopicId === topicId) {
        const remaining = topics.filter(t => t.id !== topicId);
        if (remaining.length > 0) {
          setActiveTopicId(remaining[0].id);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal-900 flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar Navigation */}
      <Sidebar 
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'create') setInitialCreateText('');
          setCurrentView(view);
        }}
        libraryCount={topics.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Navigation Bar */}
        <MobileNav 
          currentView={currentView}
          setCurrentView={(view) => {
            if (view === 'create') setInitialCreateText('');
            setCurrentView(view);
          }}
          libraryCount={topics.length}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'home' && (
            <HomeDashboard 
              topics={topics}
              onSelectTopic={handleSelectTopic}
              onStartQuiz={handleStartQuiz}
              onCreateFromQuickInput={handleCreateFromQuickInput}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'create' && (
            <CreateView 
              initialText={initialCreateText}
              onGenerate={handleGenerate}
              onCancel={() => setCurrentView('home')}
            />
          )}

          {currentView === 'study' && activeTopic && (
            <StudyMaterialView 
              topic={activeTopic}
              onBack={() => setCurrentView('library')}
              onStartQuiz={handleStartQuiz}
              onToggleStar={handleToggleStar}
            />
          )}

          {currentView === 'quiz' && activeTopic && (
            <RecallQuizView 
              topic={activeTopic}
              onCompleteQuiz={handleCompleteQuiz}
              onExitQuiz={() => setCurrentView('study')}
            />
          )}

          {currentView === 'results' && latestQuizResult && (
            <QuizResultsView 
              result={latestQuizResult}
              onRetryQuiz={() => setCurrentView('quiz')}
              onReviewNotes={() => setCurrentView('study')}
              onGoLibrary={() => setCurrentView('library')}
            />
          )}

          {currentView === 'library' && (
            <LibraryView 
              topics={topics}
              onSelectTopic={handleSelectTopic}
              onStartQuiz={handleStartQuiz}
              onToggleStar={handleToggleStar}
              onDeleteTopic={handleDeleteTopic}
              onCreateNew={() => {
                setInitialCreateText('');
                setCurrentView('create');
              }}
            />
          )}

          {currentView === 'history' && (
            <QuizHistoryView 
              quizHistory={quizHistory}
              onRetakeTopic={(topicId) => {
                setActiveTopicId(topicId);
                setCurrentView('quiz');
              }}
              onReviewTopic={(topicId) => {
                setActiveTopicId(topicId);
                setCurrentView('study');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

