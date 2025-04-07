import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      // Update password through Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Clear fields and show success message
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password updated successfully');
      
    } catch (error: any) {
      setError(error.message || 'Error updating password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmDelete) return;
    
    try {
      setLoading(true);
      
      // This is a placeholder - Supabase doesn't have a direct method to delete user accounts
      // In a real app, you would implement a serverless function to handle this securely
      alert('Account deletion would be processed here in a production environment.');
      
      // Sign out after deletion request
      await supabase.auth.signOut();
      navigate('/login');
      
    } catch (error: any) {
      setError(error.message || 'Error deleting account');
      console.error('Account deletion error:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            <SettingsIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4">Account Settings</Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Typography variant="h6" sx={{ mb: 2 }}>Security</Typography>
        
        <Box component="form" onSubmit={handlePasswordChange} sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained"
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>Danger Zone</Typography>
        
        <List>
          <ListItem 
            sx={{ 
              border: '1px solid', 
              borderColor: 'error.light', 
              borderRadius: 1,
              mb: 2 
            }}
          >
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Delete Account" 
              secondary="Permanently delete your account and all your data. This action cannot be undone."
            />
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Delete Account
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Account; 