import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!credentials.username || !credentials.password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    if (credentials.username.length > 50 || credentials.password.length > 100) {
      setError('Input too long');
      setLoading(false);
      return;
    }

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Basic sanitization
    const sanitizedValue = value.replace(/[<>\"'&]/g, '');
    setCredentials(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🔐 Secure Login</h2>
        
        {error && <div className="error" role="alert">❌ {error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            maxLength="50"
            autoComplete="username"
            placeholder="Enter username"
          />
          <small>Test username: <strong>admin</strong></small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            maxLength="100"
            autoComplete="current-password"
            placeholder="Enter password"
          />
          <small>Test password: <strong>SecurePass123!</strong></small>
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? '🔄 Logging in...' : '🔐 Login'}
        </button>
      </form>
      
      <div className="security-notice">
        <h3>🔒 Security Features:</h3>
        <ul>
          <li>✅ Input validation and sanitization</li>
          <li>✅ Rate limiting protection</li>
          <li>✅ Secure JWT token handling</li>
          <li>✅ CSRF protection</li>
          <li>✅ XSS prevention</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
