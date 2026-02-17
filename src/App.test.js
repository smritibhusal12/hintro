import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './components/Login';
import { storage } from './utils/storage';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Task Board Application', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login form', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    expect(screen.getByText('Task Board Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('shows error for invalid login', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');
    
    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  test('successful login stores user data', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');
    
    fireEvent.change(emailInput, { target: { value: 'intern@demo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'intern123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const savedUser = storage.getUser();
      expect(savedUser).toBeTruthy();
      expect(savedUser.email).toBe('intern@demo.com');
    });
  });
});
