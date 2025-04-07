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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { financesAPI } from '../services/api';
import { travelsAPI } from '../services/api';
import { FinanceRecord, Travel, FinanceType } from '../types';
import { format } from 'date-fns';

const Finances = () => {
  // State for finances and loading
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for travels (needed for dropdowns)
  const [travels, setTravels] = useState<Travel[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  // Form state
  const [currentFinance, setCurrentFinance] = useState<Partial<FinanceRecord>>({
    type: 'income',
    category: '',
    amount: 0,
    date: new Date().toISOString(),
    description: '',
    travelId: undefined
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

  // Fetch finances on component mount
  useEffect(() => {
    fetchFinances();
    fetchTravels();
  }, []);

  // Fetch finances from API
  const fetchFinances = async () => {
    setLoading(true);
    try {
      const { data, error } = await financesAPI.getAll();
      
      if (error) {
        throw error;
      }
      
      setFinances(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching finances:', err);
      setError(err.message || 'Failed to load finances. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch travels for dropdown
  const fetchTravels = async () => {
    try {
      const { data, error } = await travelsAPI.getAll();
      
      if (error) {
        throw error;
      }
      
      setTravels(data || []);
    } catch (err: any) {
      console.error('Error fetching travels:', err);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentFinance({
      type: 'income',
      category: '',
      amount: 0,
      date: new Date().toISOString(),
      description: '',
      travelId: undefined
    });
    setIsEdit(false);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentFinance(prev => ({ ...prev, [name as string]: value }));
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentFinance(prev => ({ ...prev, date: date.toISOString() }));
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (isEdit && currentFinance.id) {
        const { error } = await financesAPI.update(currentFinance.id as string, currentFinance);
        
        if (error) {
          throw error;
        }
        
        setSnackbar({ open: true, message: 'Finance record updated successfully', severity: 'success' });
      } else {
        const { error } = await financesAPI.create(currentFinance);
        
        if (error) {
          throw error;
        }
        
        setSnackbar({ open: true, message: 'Finance record created successfully', severity: 'success' });
      }
      
      // Refresh finances list
      fetchFinances();
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving finance record:', err);
      setSnackbar({ open: true, message: err.message || 'Error saving finance record', severity: 'error' });
    }
  };

  // Handle deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this finance record?')) {
      try {
        const { error } = await financesAPI.delete(id);
        
        if (error) {
          throw error;
        }
        
        fetchFinances();
        setSnackbar({ open: true, message: 'Finance record deleted successfully', severity: 'success' });
      } catch (err: any) {
        console.error('Error deleting finance record:', err);
        setSnackbar({ open: true, message: err.message || 'Error deleting finance record', severity: 'error' });
      }
    }
  };

  // Edit finance record
  const handleEdit = (finance: FinanceRecord) => {
    setCurrentFinance(finance);
    setIsEdit(true);
    setDialogOpen(true);
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
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value === 'income' ? (
            <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
          ) : (
            <MoneyOffIcon color="error" sx={{ mr: 1 }} />
          )}
          {params.value === 'income' ? 'Income' : 'Expense'}
        </Box>
      )
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.row.type === 'income' ? 'success.main' : 'error.main',
            fontWeight: 'bold'
          }}
        >
          {params.row.type === 'income' ? '+' : '-'}€{params.value}
        </Typography>
      )
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params) => formatDate(params.value as string)
    },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'travelId',
      headerName: 'Travel',
      width: 150,
      valueGetter: (params) => {
        if (!params.row.travelId) return 'General';
        const travel = travels.find(t => t.id === params.row.travelId);
        return travel ? travel.name : 'Unknown';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row as FinanceRecord)}>
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
        <Typography variant="h4">Financial Records</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEdit(false);
            setDialogOpen(true);
          }}
        >
          Add Record
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
            rows={finances}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      {/* Finance Record Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Finance Record' : 'Add New Finance Record'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={currentFinance.type || 'income'}
                    onChange={handleInputChange}
                    label="Type"
                    required
                  >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  value={currentFinance.category || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  placeholder={currentFinance.type === 'income' ? 'e.g. Participant Payment' : 'e.g. Transportation'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={currentFinance.amount || 0}
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={currentFinance.date ? new Date(currentFinance.date) : null}
                    onChange={handleDateChange}
                    sx={{ width: '100%', mt: 2 }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Related Travel (Optional)</InputLabel>
                  <Select
                    name="travelId"
                    value={currentFinance.travelId || ''}
                    onChange={handleInputChange}
                    label="Related Travel (Optional)"
                  >
                    <MenuItem value="">General (No specific travel)</MenuItem>
                    {travels.map(travel => (
                      <MenuItem key={travel.id} value={travel.id}>
                        {travel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={currentFinance.description || ''}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color={currentFinance.type === 'income' ? 'success' : 'primary'}>
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

export default Finances; 