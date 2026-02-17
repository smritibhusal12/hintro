import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(undefined);

const HARDCODED_EMAIL = 'intern@demo.com';
const HARDCODED_PASSWORD = 'intern123';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (email, password, rememberMe) => {
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      const userData = { email, rememberMe };
      setUser(userData);
      storage.saveUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storage.clearUser();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
