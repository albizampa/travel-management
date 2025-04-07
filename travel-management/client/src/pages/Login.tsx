import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
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
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' } 
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Typography>
            </Grid>
            <Grid item>
              <Typography 
                variant="body2"
                sx={{ 
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' } 
                }}
                onClick={() => navigate('/signup')}
              >
                Don't have an account? Sign Up
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 