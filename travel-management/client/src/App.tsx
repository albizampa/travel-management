import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Simple placeholder components
const Dashboard = () => <div>Dashboard Page</div>;
const Travels = () => <div>Travels Page</div>;
const Participants = () => <div>Participants Page</div>;

// Simple Login component
const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('token', 'demo-token');
      setIsAuthenticated(true);
    }
  };
  
  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Travel Management</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button 
          type="submit"
          style={{ 
            background: '#1976d2', 
            color: 'white', 
            padding: '10px 15px', 
            border: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Login
        </button>
        <p><small>Use admin/password to login</small></p>
      </form>
    </div>
  );
};

// Simple ProtectedRoute component
const ProtectedRoute = ({ 
  isAuthenticated, 
  children 
}: { 
  isAuthenticated: boolean, 
  children: React.ReactNode 
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated && (
        <div style={{ 
          background: '#333', 
          color: 'white', 
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ marginRight: 20 }}>Travel Management</span>
            <a href="/" style={{ color: 'white', marginRight: 15 }}>Dashboard</a>
            <a href="/travels" style={{ color: 'white', marginRight: 15 }}>Travels</a>
            <a href="/participants" style={{ color: 'white' }}>Participants</a>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
      
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/travels"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Travels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/participants"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Participants />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App; 