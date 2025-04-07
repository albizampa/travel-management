import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Mock data - in real app this would come from API
const travelsData = [
  { id: 1, name: 'Summer Retreat', date: '2023-07-15', participants: 25, revenue: 12500 },
  { id: 2, name: 'Winter Adventure', date: '2023-12-05', participants: 18, revenue: 9000 },
  { id: 3, name: 'Spring Break', date: '2024-03-20', participants: 30, revenue: 15000 },
  { id: 4, name: 'Fall Exploration', date: '2023-10-10', participants: 22, revenue: 11000 },
];

const financialData = [
  { name: 'Q1', income: 25000, expenses: 18000 },
  { name: 'Q2', income: 32000, expenses: 22000 },
  { name: 'Q3', income: 28000, expenses: 19000 },
  { name: 'Q4', income: 35000, expenses: 24000 },
];

const participantData = [
  { name: 'New', value: 30 },
  { name: 'Returning', value: 70 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>
      
      {user && (
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user.username} ({user.role})
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Travels
            </Typography>
            <Typography component="p" variant="h4">
              {travelsData.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Participants
            </Typography>
            <Typography component="p" variant="h4">
              {travelsData.reduce((sum, travel) => sum + travel.participants, 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography component="p" variant="h4">
              €{travelsData.reduce((sum, travel) => sum + travel.revenue, 0)}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Financial Overview
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={financialData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Participant Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={participantData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {participantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Upcoming Travels */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Upcoming Travels
            </Typography>
            <List>
              {travelsData.map((travel, index) => (
                <React.Fragment key={travel.id}>
                  <ListItem>
                    <ListItemText
                      primary={travel.name}
                      secondary={`Date: ${travel.date} | Participants: ${travel.participants} | Revenue: €${travel.revenue}`}
                    />
                  </ListItem>
                  {index < travelsData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 