import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'user-new',
  name: 'Learner',
  email: 'learner@recallme.app',
  avatar: 'ME',
  streak: 0,
  dailyGoal: 3,
  institution: '',
  joinedDate: 'Today',
  retentionAverage: 0,
  notifications: true,
  spacedInterval: '48h'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('recallme_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('recallme_auth') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('recallme_user', JSON.stringify(currentUser));
        localStorage.setItem('recallme_auth', 'true');
      } else {
        localStorage.removeItem('recallme_user');
        localStorage.setItem('recallme_auth', 'false');
      }
    } catch {
      // storage unavailable
    }
  }, [currentUser]);

  const login = (email, password) => {
    // Realistic authentication validation
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const user = {
      ...DEFAULT_USER,
      email: email,
      name: formattedName.includes('.') ? formattedName.replace('.', ' ') : formattedName + ' Student',
      avatar: formattedName.slice(0, 2).toUpperCase()
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    return { success: true };
  };

  const signup = (name, email, password) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

    const user = {
      ...DEFAULT_USER,
      id: 'user-' + Date.now(),
      name: name,
      email: email,
      avatar: initials,
      streak: 1,
      joinedDate: 'Today'
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

