import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    // You could return a loading spinner here
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 