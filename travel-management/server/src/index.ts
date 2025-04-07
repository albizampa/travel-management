import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database connection and models
import { sequelize } from './models/index';

// Import routes
import authRoutes from './routes/auth.routes';
import travelsRoutes from './routes/travels.routes';
import participantsRoutes from './routes/participants.routes';
import financesRoutes from './routes/finances.routes';
import contactsRoutes from './routes/contacts.routes';
import adminRoutes from './routes/admin.routes';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/travels', travelsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Travel Management API' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models (in development)
    // In production, use migrations instead
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer(); 