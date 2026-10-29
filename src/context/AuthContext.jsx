import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiSignup, apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('recallme_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const isAuth = localStorage.getItem('recallme_auth');
      const saved = localStorage.getItem('recallme_user');
      return isAuth === 'true' && saved !== null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (currentUser && isAuthenticated) {
        localStorage.setItem('recallme_user', JSON.stringify(currentUser));
        localStorage.setItem('recallme_auth', 'true');
      } else {
        localStorage.removeItem('recallme_user');
        localStorage.setItem('recallme_auth', 'false');
      }
    } catch {
      // storage unavailable
    }
  }, [currentUser, isAuthenticated]);

  /**
   * Strict Signup: First-time users register here.
   */
  const signup = async (name, email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    // 1. Try Backend SQLite Signup
    const backendRes = await apiSignup(cleanName, cleanEmail, password);
    if (!backendRes.offline) {
      if (!backendRes.success) {
        return { success: false, error: backendRes.error };
      }
      setCurrentUser(backendRes.user);
      setIsAuthenticated(true);
      return { success: true };
    }

    // 2. Resilient Local Registry if backend is offline
    const registeredUsers = JSON.parse(localStorage.getItem('recallme_registered_users') || '[]');
    const exists = registeredUsers.find(u => u.email === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const initials = cleanName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

    const newUser = {
      id: 'user-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password, // stored locally for offline mode validation
      avatar: initials,
      streak: 0,
      dailyGoal: 3,
      joinedDate: 'Today',
      retentionAverage: 0,
      notifications: true,
      spacedInterval: '48h'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('recallme_registered_users', JSON.stringify(registeredUsers));

    const { password: _, ...userProfile } = newUser;
    setCurrentUser(userProfile);
    setIsAuthenticated(true);
    return { success: true };
  };

  /**
   * Strict Login: Rejects if the user has NOT signed up first!
   */
  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Try Backend SQLite Login
    const backendRes = await apiLogin(cleanEmail, password);
    if (!backendRes.offline) {
      if (!backendRes.success) {
        return { success: false, error: backendRes.error };
      }
      setCurrentUser(backendRes.user);
      setIsAuthenticated(true);
      return { success: true };
    }

    // 2. Resilient Local Registry if backend is offline
    const registeredUsers = JSON.parse(localStorage.getItem('recallme_registered_users') || '[]');
    const existing = registeredUsers.find(u => u.email === cleanEmail);

    if (!existing) {
      return {
        success: false,
        error: 'No account found with this email. Please sign up first!'
      };
    }

    if (existing.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials.'
      };
    }

    const { password: _, ...userProfile } = existing;
    setCurrentUser(userProfile);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('recallme_user');
    localStorage.setItem('recallme_auth', 'false');
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
