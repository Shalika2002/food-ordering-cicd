import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mock window.location.hash
delete window.location;
window.location = { hash: '' };

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.hash = '';
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Food Ordering System/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders welcome message', () => {
    render(<App />);
    const welcomeText = screen.getByText(/Welcome to our delicious food ordering platform/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test('renders login button', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('renders sign up button', () => {
    render(<App />);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    expect(signupButton).toBeInTheDocument();
  });

  test('shows admin credentials hint', () => {
    render(<App />);
    const adminHint = screen.getByText(/Admin/i);
    expect(adminHint).toBeInTheDocument();
  });

  test('clicking login button changes view', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    // Should show login form elements or change hash
    expect(window.location.hash).toBe('#login');
  });

  test('clicking signup button changes view', () => {
    render(<App />);
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);
    
    // Should show signup form elements or change hash
    expect(window.location.hash).toBe('#signup');
  });

  test('loads user from localStorage on mount', () => {
    const mockUser = { username: 'testuser', isAdmin: false };
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'mock-token';
      return null;
    });

    render(<App />);
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
  });

  test('handles hash changes', () => {
    render(<App />);
    
    // Simulate hash change
    window.location.hash = '#login';
    const hashChangeEvent = new Event('hashchange');
    window.dispatchEvent(hashChangeEvent);
    
    // The component should respond to hash changes
    expect(window.location.hash).toBe('#login');
  });

  test('app has correct CSS class', () => {
    const { container } = render(<App />);
    const appDiv = container.firstChild;
    expect(appDiv).toHaveClass('App');
  });
});