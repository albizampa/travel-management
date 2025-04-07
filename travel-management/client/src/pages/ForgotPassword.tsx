import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
  Link,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { supabase } from '../lib/supabase';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred sending the password reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success ? (
          <Box sx={{ mt: 2, width: '100%' }}>
            <Alert severity="success">
              Password reset link has been sent to your email. Please check your inbox.
            </Alert>
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ mt: 3 }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword; 