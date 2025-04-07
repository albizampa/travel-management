import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database configuration from environment variables
const DB_NAME = process.env.DB_NAME || 'travel_management';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_URL = process.env.DATABASE_URL; // For platforms like Vercel that provide a full URL

// Initialize Sequelize with database configuration
let sequelize: Sequelize;

// If a full database URL is provided (e.g., on Vercel), use that
if (DB_URL) {
  sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Needed for some cloud providers
      }
    },
    logging: false
  });
} else {
  // Otherwise use individual connection parameters
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false
  });
}

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the Sequelize instance
export { sequelize, testConnection }; 