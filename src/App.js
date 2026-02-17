import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Demo mode - set to false to require login, true to bypass
  const isDemoMode = true;
  return (isAuthenticated || isDemoMode) ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" />} 
                />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
