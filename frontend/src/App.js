import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import FoodMenu from './components/Food/FoodMenu';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setCurrentView('menu');
    }

    // Handle hash changes for navigation
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (['login', 'signup', 'menu', 'admin'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('menu');
    window.location.hash = 'menu';
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentView('menu');
    window.location.hash = 'menu';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
    window.location.hash = '';
  };

  const renderNavbar = () => {
    if (!user) return null;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">🍕 Food Ordering</span>
          
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user.username}!
              {user.isAdmin && <span className="badge bg-warning ms-1">Admin</span>}
            </span>
            
            <div className="btn-group">
              <button 
                className={`btn ${currentView === 'menu' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => { setCurrentView('menu'); window.location.hash = 'menu'; }}
              >
                Menu
              </button>
              
              {user.isAdmin && (
                <button 
                  className={`btn ${currentView === 'admin' ? 'btn-light' : 'btn-outline-light'}`}
                  onClick={() => { setCurrentView('admin'); window.location.hash = 'admin'; }}
                >
                  Dashboard
                </button>
              )}
              
              <button 
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Login onLogin={handleLogin} />
              </div>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Signup onSignup={handleSignup} />
              </div>
            </div>
          </div>
        );

      case 'menu':
        return user ? <FoodMenu user={user} /> : null;

      case 'admin':
        return user && user.isAdmin ? <AdminDashboard user={user} /> : null;

      default:
        return (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body text-center">
                    <h1 className="card-title text-primary">🍕 Food Ordering System</h1>
                    <p className="card-text lead">Welcome to our delicious food ordering platform!</p>
                    <p className="card-text">Fresh ingredients, quick delivery, and amazing taste!</p>
                    
                    <div className="mt-4">
                      <button 
                        className="btn btn-primary btn-lg me-3"
                        onClick={() => { setCurrentView('login'); window.location.hash = 'login'; }}
                      >
                        Login
                      </button>
                      <button 
                        className="btn btn-success btn-lg"
                        onClick={() => { setCurrentView('signup'); window.location.hash = 'signup'; }}
                      >
                        Sign Up
                      </button>
                    </div>

                    <div className="mt-4">
                      <small className="text-muted">
                        Admin? Use username: <strong>admin</strong>, password: <strong>admin123</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderNavbar()}
      <div className="mt-3">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;