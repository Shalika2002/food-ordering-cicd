import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';

// Mock fetch
global.fetch = jest.fn();

describe('Signup Component', () => {
  const mockOnSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('renders signup form', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('renders login link', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const loginLink = screen.getByText(/Login here/i);
    expect(loginLink).toBeInTheDocument();
  });

  test('allows user to type in all fields', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows validation errors for empty fields', async () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
    });
  });

  test('successful signup calls onSignup callback', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        token: 'mock-token',
        user: { username: 'testuser', email: 'test@example.com', isAdmin: false }
      })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<Signup onSignup={mockOnSignup} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    
    await waitFor(() => {
      expect(mockOnSignup).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        isAdmin: false
      });
    });
  });

  test('handles signup error gracefully', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ message: 'Username already exists' })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    render(<Signup onSignup={mockOnSignup} />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Username already exists/i)).toBeInTheDocument();
    });
  });

  test('clicking login link changes hash', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const loginLink = screen.getByText(/Login here/i);
    fireEvent.click(loginLink);
    
    expect(window.location.hash).toBe('#login');
  });

  test('password field is of type password', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('email field is of type email', () => {
    render(<Signup onSignup={mockOnSignup} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});