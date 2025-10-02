import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await api.get('/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Decode user info from token payload (basic JWT decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        // Fallback for simple tokens
        setUser({ username: 'admin', role: 'admin', id: 1 });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      if (username.length > 50 || password.length > 100) {
        throw new Error('Input too long');
      }
      
      const sanitizedUsername = username.replace(/[<>\"'&]/g, '');
      
      const response = await api.post('/auth/login', {
        username: sanitizedUsername,
        password: password
      });

      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
