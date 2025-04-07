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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { participantsAPI } from '../services/api';
import { travelsAPI } from '../services/api';
import { Participant, Travel, ParticipantStatus } from '../types';

const Participants = () => {
  // State for participants and loading
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for travels (needed for dropdowns)
  const [travels, setTravels] = useState<Travel[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  // Form state
  const [currentParticipant, setCurrentParticipant] = useState<Partial<Participant>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    travelId: 0,
    amountPaid: 0,
    status: 'registered'
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

  // Fetch participants on component mount
  useEffect(() => {
    fetchParticipants();
    fetchTravels();
  }, []);

  // Fetch participants from API
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const response = await participantsAPI.getAll();
      setParticipants(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to load participants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch travels for dropdown
  const fetchTravels = async () => {
    try {
      const response = await travelsAPI.getAll();
      setTravels(response.data);
    } catch (err) {
      console.error('Error fetching travels:', err);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentParticipant({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      travelId: 0,
      amountPaid: 0,
      status: 'registered'
    });
    setIsEdit(false);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentParticipant(prev => ({ ...prev, [name as string]: value }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEdit && currentParticipant.id) {
        await participantsAPI.update(currentParticipant.id, currentParticipant);
        setSnackbar({ open: true, message: 'Participant updated successfully', severity: 'success' });
      } else {
        await participantsAPI.create(currentParticipant);
        setSnackbar({ open: true, message: 'Participant created successfully', severity: 'success' });
      }
      
      // Refresh participants list
      fetchParticipants();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving participant:', err);
      setSnackbar({ open: true, message: 'Error saving participant', severity: 'error' });
    }
  };

  // Handle deletion
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await participantsAPI.delete(id);
        fetchParticipants();
        setSnackbar({ open: true, message: 'Participant deleted successfully', severity: 'success' });
      } catch (err) {
        console.error('Error deleting participant:', err);
        setSnackbar({ open: true, message: 'Error deleting participant', severity: 'error' });
      }
    }
  };

  // Edit participant
  const handleEdit = (participant: Participant) => {
    setCurrentParticipant(participant);
    setIsEdit(true);
    setDialogOpen(true);
  };

  // Column definitions for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'travelId',
      headerName: 'Travel',
      width: 130,
      valueGetter: (params) => {
        const travel = travels.find(t => t.id === params.row.travelId);
        return travel ? travel.name : 'Unknown';
      }
    },
    {
      field: 'amountPaid',
      headerName: 'Amount Paid',
      width: 130,
      valueFormatter: (params) => `€${params.value}`
    },
    { field: 'status', headerName: 'Status', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row as Participant)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id as number)}>
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
        <Typography variant="h4">Participants</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEdit(false);
            setDialogOpen(true);
          }}
        >
          Add Participant
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 500, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={participants}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Participant Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Participant' : 'Add New Participant'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="firstName"
              label="First Name"
              value={currentParticipant.firstName || ''}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={currentParticipant.lastName || ''}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={currentParticipant.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="phone"
              label="Phone"
              value={currentParticipant.phone || ''}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Travel</InputLabel>
              <Select
                name="travelId"
                value={currentParticipant.travelId || ''}
                onChange={handleInputChange}
                label="Travel"
                required
              >
                {travels.map(travel => (
                  <MenuItem key={travel.id} value={travel.id}>
                    {travel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="amountPaid"
              label="Amount Paid"
              type="number"
              value={currentParticipant.amountPaid || 0}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={currentParticipant.status || 'registered'}
                onChange={handleInputChange}
                label="Status"
                required
              >
                <MenuItem value="registered">Registered</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="notes"
              label="Notes"
              value={currentParticipant.notes || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              sx={{ gridColumn: '1 / span 2' }}
            />
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

export default Participants; 