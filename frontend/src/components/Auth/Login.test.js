import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

// Mock fetch
global.fetch = jest.fn();

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('renders login form', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('renders signup link', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const signupLink = screen.getByText(/Sign up here/i);
    expect(signupLink).toBeInTheDocument();
  });

  test('allows user to type in username field', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    expect(usernameInput.value).toBe('testuser');
  });

  test('allows user to type in password field', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });

  test('shows validation error for empty username', async () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for empty password', async () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('successful login calls onLogin callback', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        token: 'mock-token',
        user: { username: 'testuser', isAdmin: false }
      })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        username: 'testuser',
        isAdmin: false
      });
    });
  });

  test('handles login error gracefully', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('clicking signup link changes hash', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const signupLink = screen.getByText(/Sign up here/i);
    fireEvent.click(signupLink);
    
    expect(window.location.hash).toBe('#signup');
  });

  test('form has correct CSS classes', () => {
    const { container } = render(<Login onLogin={mockOnLogin} />);
    
    const form = container.querySelector('form');
    expect(form).toHaveClass('card');
  });
});