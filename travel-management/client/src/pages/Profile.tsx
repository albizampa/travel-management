import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get profile from users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }

      // Set user data
      setUserData(user);
      setEmail(user.email || '');
      
      // Set profile data if exists
      if (profile) {
        setUsername(profile.username || '');
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
      }
      
    } catch (error: any) {
      setError(error.message || 'Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Check if user exists
      if (!userData?.id) {
        throw new Error('User not authenticated');
      }
      
      // Update profile in users table
      const { error } = await supabase
        .from('users')
        .update({
          username,
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', userData.id);
      
      if (error) {
        throw error;
      }
      
      setSuccess('Profile updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4">Your Profile</Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleUpdateProfile}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={email}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Email cannot be changed. Contact support if you need to update your email.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 