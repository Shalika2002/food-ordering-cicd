import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdminConfig = async () => {
    if (user?.role !== 'admin') return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5001/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch admin configuration');
      console.error('Admin config error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminConfig();
  }, [fetchAdminConfig]);

  return (
    <div className="dashboard-container">
      <h2>📊 Secure Dashboard</h2>
      
      <div className="dashboard-card">
        <h3>👤 User Information</h3>
        <div className="user-info">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Role:</strong> 
            <span className={`role-badge ${user?.role}`}>
              {user?.role}
            </span>
          </p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Login Status:</strong> 
            <span className="status-active">✅ Authenticated</span>
          </p>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="dashboard-card">
          <h3>⚙️ Admin Configuration</h3>
          {loading ? (
            <div className="loading-spinner">Loading admin data...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : adminData ? (
            <div className="admin-config">
              <h4>System Settings:</h4>
              <ul>
                <li><strong>Max Upload Size:</strong> {adminData.settings?.maxUploadSize}</li>
                <li><strong>Session Timeout:</strong> {adminData.settings?.sessionTimeout}</li>
                <li><strong>Allowed File Types:</strong> {adminData.settings?.allowedFileTypes?.join(', ')}</li>
              </ul>
              <button onClick={fetchAdminConfig} className="refresh-btn">
                🔄 Refresh Config
              </button>
            </div>
          ) : (
            <button onClick={fetchAdminConfig} className="load-btn">
              📥 Load Admin Config
            </button>
          )}
        </div>
      )}

      <div className="dashboard-card">
        <h3>🛡️ Security Status</h3>
        <div className="security-status">
          <div className="security-item">
            <span className="status-icon">✅</span>
            <span>JWT Token Authentication</span>
          </div>
          <div className="security-item">
            <span className="status-icon">✅</span>
            <span>Role-Based Access Control</span>
          </div>
          <div className="security-item">
            <span className="status-icon">✅</span>
            <span>Secure Session Management</span>
          </div>
          <div className="security-item">
            <span className="status-icon">✅</span>
            <span>Protected API Endpoints</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>🔗 Quick Actions</h3>
        <div className="action-buttons">
          <a href="/menu" className="action-btn">
            🍕 View Menu
          </a>
          {user?.role === 'admin' && (
            <a href="/admin" className="action-btn admin-btn">
              ⚙️ Admin Panel
            </a>
          )}
          <a href="/security-test" className="action-btn">
            🔒 Security Tests
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;