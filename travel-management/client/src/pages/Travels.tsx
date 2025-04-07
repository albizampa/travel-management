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
  Snackbar,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { travelsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Travel, TravelStatus } from '../types';
import { format } from 'date-fns';

const Travels = () => {
  const navigate = useNavigate();
  
  // State for travels and loading
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  // Form state
  const [currentTravel, setCurrentTravel] = useState<Partial<Travel>>({
    name: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    location: '',
    travelAgency: '',
    commission: 0,
    totalFee: 0,
    status: 'planned'
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

  // Fetch travels on component mount
  useEffect(() => {
    fetchTravels();
  }, []);

  // Fetch travels from API
  const fetchTravels = async () => {
    setLoading(true);
    try {
      const response = await travelsAPI.getAll();
      setTravels(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching travels:', err);
      setError('Failed to load travels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentTravel({
      name: '',
      description: '',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: '',
      travelAgency: '',
      commission: 0,
      totalFee: 0,
      status: 'planned'
    });
    setIsEdit(false);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentTravel(prev => ({ ...prev, [name as string]: value }));
  };

  // Handle date change
  const handleDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setCurrentTravel(prev => ({ ...prev, [fieldName]: date.toISOString() }));
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEdit && currentTravel.id) {
        await travelsAPI.update(currentTravel.id, currentTravel);
        setSnackbar({ open: true, message: 'Travel updated successfully', severity: 'success' });
      } else {
        await travelsAPI.create(currentTravel);
        setSnackbar({ open: true, message: 'Travel created successfully', severity: 'success' });
      }
      
      // Refresh travels list
      fetchTravels();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving travel:', err);
      setSnackbar({ open: true, message: 'Error saving travel', severity: 'error' });
    }
  };

  // Handle deletion
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this travel?')) {
      try {
        await travelsAPI.delete(id);
        fetchTravels();
        setSnackbar({ open: true, message: 'Travel deleted successfully', severity: 'success' });
      } catch (err) {
        console.error('Error deleting travel:', err);
        setSnackbar({ open: true, message: 'Error deleting travel', severity: 'error' });
      }
    }
  };

  // Edit travel
  const handleEdit = (travel: Travel) => {
    setCurrentTravel(travel);
    setIsEdit(true);
    setDialogOpen(true);
  };

  // View participants for a travel
  const handleViewParticipants = (travelId: number) => {
    navigate(`/participants?travelId=${travelId}`);
  };

  // View finances for a travel
  const handleViewFinances = (travelId: number) => {
    navigate(`/finances?travelId=${travelId}`);
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Column definitions for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 180 },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      width: 120,
      valueFormatter: (params) => formatDate(params.value)
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      width: 120,
      valueFormatter: (params) => formatDate(params.value)
    },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'travelAgency', headerName: 'Agency', width: 150 },
    {
      field: 'commission',
      headerName: 'Commission',
      width: 120,
      valueFormatter: (params) => `€${params.value}`
    },
    {
      field: 'totalFee',
      headerName: 'Total Fee',
      width: 120,
      valueFormatter: (params) => `€${params.value}`
    },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row as Travel)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Participants">
            <IconButton onClick={() => handleViewParticipants(params.row.id as number)}>
              <PeopleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Finances">
            <IconButton onClick={() => handleViewFinances(params.row.id as number)}>
              <AccountBalanceIcon />
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
        <Typography variant="h4">Travels</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEdit(false);
            setDialogOpen(true);
          }}
        >
          Add Travel
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 600, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={travels}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Travel Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Travel' : 'Add New Travel'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Travel Name"
                  value={currentTravel.name || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={currentTravel.description || ''}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={currentTravel.startDate ? new Date(currentTravel.startDate) : null}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    sx={{ width: '100%', mt: 2 }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={currentTravel.endDate ? new Date(currentTravel.endDate) : null}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    sx={{ width: '100%', mt: 2 }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="location"
                  label="Location"
                  value={currentTravel.location || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="travelAgency"
                  label="Travel Agency"
                  value={currentTravel.travelAgency || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="commission"
                  label="Commission"
                  type="number"
                  value={currentTravel.commission || 0}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="totalFee"
                  label="Total Fee"
                  type="number"
                  value={currentTravel.totalFee || 0}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={currentTravel.status || 'planned'}
                    onChange={handleInputChange}
                    label="Status"
                    required
                  >
                    <MenuItem value="planned">Planned</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
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

export default Travels;