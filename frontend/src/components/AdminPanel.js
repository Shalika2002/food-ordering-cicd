import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch users: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5001/api/debug', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDebugInfo(response.data);
    } catch (error) {
      setDebugInfo({ 
        error: error.response?.data?.error || 'Debug endpoint not available in production' 
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDebugInfo();
  }, []);

  return (
    <div className="admin-panel">
      <h2>⚙️ Admin Control Panel</h2>
      <p className="admin-subtitle">Secure administrative interface</p>

      <div className="admin-card">
        <div className="admin-header">
          <h3>👥 User Management</h3>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading users...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="users-table">
            <h4>Registered Users ({users.length})</h4>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn small">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={fetchUsers} className="refresh-btn">
              🔄 Refresh Users
            </button>
          </div>
        )}
      </div>

      <div className="admin-card">
        <h3>🔧 System Information</h3>
        <div className="system-info">
          <div className="info-item">
            <strong>Server Status:</strong> 
            <span className="status-active">🟢 Online</span>
          </div>
          <div className="info-item">
            <strong>Security Level:</strong> 
            <span className="status-secure">🔒 High</span>
          </div>
          <div className="info-item">
            <strong>API Version:</strong> 
            <span>v1.0</span>
          </div>
          <div className="info-item">
            <strong>Environment:</strong> 
            <span>{process.env.NODE_ENV || 'Development'}</span>
          </div>
        </div>

        {debugInfo && (
          <div className="debug-info">
            <h4>🐛 Debug Information</h4>
            {debugInfo.error ? (
              <div className="error-info">
                <p>{debugInfo.error}</p>
              </div>
            ) : (
              <div className="debug-details">
                <p><strong>Message:</strong> {debugInfo.message}</p>
                <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h3>🛡️ Security Features Active</h3>
        <div className="security-features">
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>JWT Authentication</span>
          </div>
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>Role-Based Authorization</span>
          </div>
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>Input Validation & Sanitization</span>
          </div>
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>Security Headers (CSP, XSS, etc.)</span>
          </div>
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>Rate Limiting</span>
          </div>
          <div className="feature-item active">
            <span className="feature-icon">✅</span>
            <span>CORS Protection</span>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h3>🚀 Admin Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => window.open('http://localhost:5001/admin', '_blank')}
            className="action-btn"
          >
            🌐 Server Admin Panel
          </button>
          <button 
            onClick={() => window.open('http://localhost:5001/api/config.xml', '_blank')}
            className="action-btn"
          >
            📄 Configuration XML
          </button>
          <a href="/security-test" className="action-btn">
            🔒 Run Security Tests
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
