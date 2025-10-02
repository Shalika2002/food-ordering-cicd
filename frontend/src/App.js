import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Auth/Signup';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import SecurityTest from './components/SecurityTest';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>🔒 Secure Food Ordering</h1>
            <NavigationBar />
          </header>
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
              <Route path="/security-test" element={<SecurityTest />} />
              <Route path="/" element={<Navigate to="/menu" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const NavigationBar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="/menu">Menu</a>
        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            {user.role === 'admin' && <a href="/admin">Admin</a>}
            <a href="/security-test">Security Test</a>
            <button onClick={logout} className="logout-btn">
              Logout ({user.username})
            </button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requiredRole && user.role !== requiredRole) {
    return <div className="error">Access denied. {requiredRole} role required.</div>;
  }
  
  return children;
};

export default App;