import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages
import Dashboard from './pages/Dashboard';
import Travels from './pages/Travels';
import Participants from './pages/Participants';
import Finances from './pages/Finances';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Account from './pages/Account';

// Import components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Supabase client
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      // Clean up subscription when component unmounts
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    // You could create a proper loading screen here
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" /> : <Signup />} 
          />
          <Route 
            path="/forgot-password" 
            element={user ? <Navigate to="/" /> : <ForgotPassword />} 
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travels"
            element={
              <ProtectedRoute>
                <Travels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <ProtectedRoute>
                <Participants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finances"
            element={
              <ProtectedRoute>
                <Finances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 