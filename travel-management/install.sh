#!/bin/bash

echo "Installing dependencies for Travel Management System..."

echo
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo
echo "All dependencies installed successfully!"
echo
echo "Checking if .env file exists..."
if [ -f server/.env ]; then
    echo ".env file found. To reset it, delete it and run this script again."
else
    echo "Creating .env file..."
    cp server/.env.example server/.env
    echo "Please update the database credentials in server/.env"
fi

echo
echo "Next steps:"
echo "1. Update your database credentials in travel-management/server/.env"
echo "2. Run 'npm run setup' in the server directory to create and seed the database"
echo "3. Run 'npm run dev' in the server directory to start the backend"
echo "4. Run 'npm start' in the client directory to start the frontend"
echo
echo "See DEVELOPER.md for more details" 