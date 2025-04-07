import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { contactsAPI } from '../services/api';
import { Contact } from '../types';

const Contacts = () => {
  // State for contacts and loading
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  // Form state
  const [currentContact, setCurrentContact] = useState<Partial<Contact>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    notes: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await contactsAPI.getAll();
      
      if (error) {
        throw error;
      }
      
      setContacts(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to load contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      notes: ''
    });
    setIsEdit(false);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentContact(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEdit && currentContact.id) {
        const { error } = await contactsAPI.update(currentContact.id as string, currentContact);
        
        if (error) {
          throw error;
        }
        
        setSnackbar({ open: true, message: 'Contact updated successfully', severity: 'success' });
      } else {
        const { error } = await contactsAPI.create(currentContact);
        
        if (error) {
          throw error;
        }
        
        setSnackbar({ open: true, message: 'Contact created successfully', severity: 'success' });
      }
      
      // Refresh contacts list
      fetchContacts();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving contact:', err);
      setSnackbar({ open: true, message: err.message || 'Error saving contact', severity: 'error' });
    }
  };

  // Handle deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const { error } = await contactsAPI.delete(id);
        
        if (error) {
          throw error;
        }
        
        fetchContacts();
        setSnackbar({ open: true, message: 'Contact deleted successfully', severity: 'success' });
      } catch (err: any) {
        console.error('Error deleting contact:', err);
        setSnackbar({ open: true, message: err.message || 'Error deleting contact', severity: 'error' });
      }
    }
  };

  // Edit contact
  const handleEdit = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEdit(true);
    setDialogOpen(true);
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchValue = searchTerm.toLowerCase();
    return (
      contact.firstName?.toLowerCase().includes(searchValue) ||
      contact.lastName?.toLowerCase().includes(searchValue) ||
      contact.email?.toLowerCase().includes(searchValue) ||
      contact.organization?.toLowerCase().includes(searchValue) ||
      contact.role?.toLowerCase().includes(searchValue)
    );
  });

  // Column definitions for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      renderCell: (params) => (
        params.value ? (
          <a href={`mailto:${params.value}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              {params.value}
            </Box>
          </a>
        ) : ''
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <a href={`tel:${params.value}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              {params.value}
            </Box>
          </a>
        ) : ''
      )
    },
    { 
      field: 'organization', 
      headerName: 'Organization', 
      width: 180,
      renderCell: (params) => (
        params.value ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
            {params.value}
          </Box>
        ) : ''
      )
    },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row as Contact)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id as string)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Contacts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEdit(false);
            setDialogOpen(true);
          }}
        >
          Add Contact
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search contacts"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredContacts}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Contact Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={currentContact.firstName || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={currentContact.lastName || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={currentContact.email || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  value={currentContact.phone || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="organization"
                  label="Organization"
                  value={currentContact.organization || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="role"
                  label="Role"
                  value={currentContact.role || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  value={currentContact.notes || ''}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contacts; 