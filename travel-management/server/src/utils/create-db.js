const { Client } = require('pg');
require('dotenv').config();

/**
 * Script to create the travel_management database if it doesn't exist
 * Run with: node src/utils/create-db.js
 */
async function createDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Connect to postgres database to create our app database
    database: 'postgres',
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    
    // Check if database exists
    const checkDbResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );
    
    if (checkDbResult.rowCount === 0) {
      console.log(`Database "${process.env.DB_NAME}" does not exist. Creating...`);
      
      // Create database - need to escape identifiers for safety
      await client.query(`CREATE DATABASE ${escapeIdentifier(process.env.DB_NAME)}`);
      
      console.log(`Database "${process.env.DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists.`);
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Helper to safely escape DB identifiers
function escapeIdentifier(str) {
  return '"' + str.replace(/"/g, '""') + '"';
}

// Run the function
createDatabase(); 