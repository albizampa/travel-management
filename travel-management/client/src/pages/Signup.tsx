import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Container,
  Alert,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { supabase } from '../lib/supabase';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data) {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            Registration successful! Please check your email for verification instructions.
          </Alert>
        )}
        {!success && (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Signup; 