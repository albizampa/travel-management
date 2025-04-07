# Travel Management System - Developer Guide

This document contains technical information for developers working on this project.

## Architecture Overview

The project is built with a clear separation between frontend and backend:

### Frontend (React + TypeScript)

- `client/` directory contains the frontend application
- Built with React and TypeScript
- Uses Material UI for components
- Responsive design for all device sizes
- State management with React hooks
- Communication with backend via Axios

### Backend (Node.js + Express + PostgreSQL)

- `server/` directory contains the REST API
- Built with Node.js, Express, and TypeScript
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Role-based access control
- RESTful API endpoints

## Development Setup

### Prerequisites

1. Install Node.js (v14+) and npm
2. Install PostgreSQL
3. Create a PostgreSQL database named `travel_management`

### Backend Setup

1. Navigate to the server directory:
```bash
cd travel-management/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials

5. Create and seed the database with sample data:
```bash
npm run setup
```
   - This will:
   - Create the database if it doesn't exist
   - Initialize all tables
   - Populate tables with sample data

6. Start the development server:
```bash
npm run dev
```

The API will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
```bash
cd travel-management/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

### Docker Setup (Alternative)

If you prefer to use Docker for development:

1. Make sure Docker and Docker Compose are installed on your machine

2. Create a `.env` file in the project root with database credentials:
```bash
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=travel_management
JWT_SECRET=your_secret_key
```

3. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml up
```

This will start:
- PostgreSQL database at port 5432
- Backend API at port 5000
- Frontend client at port 3000

4. To stop the services:
```bash
docker-compose -f docker-compose.dev.yml down
```

5. To rebuild containers after making changes to Dockerfiles:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Database Schema

### Users
- id: Primary key
- username: Unique username
- email: Unique email address
- password: Hashed password
- role: User role (admin/user)

### Travels
- id: Primary key
- name: Travel name
- description: Travel description
- startDate: Start date
- endDate: End date
- location: Travel location
- travelAgency: Associated travel agency
- commission: Commission amount
- totalFee: Total fee for the travel
- status: Travel status (planned/ongoing/completed/cancelled)

### Participants
- id: Primary key
- firstName: First name
- lastName: Last name
- email: Email address
- phone: Phone number
- travelId: Foreign key to Travels
- amountPaid: Amount paid by participant
- status: Participant status (registered/confirmed/cancelled)
- notes: Additional notes

### Finances
- id: Primary key
- type: Finance type (income/expense)
- category: Finance category
- amount: Amount
- date: Transaction date
- description: Transaction description
- travelId: Optional foreign key to Travels

### Contacts
- id: Primary key
- firstName: First name
- lastName: Last name
- email: Email address
- phone: Phone number
- organization: Organization name
- role: Contact role
- notes: Additional notes

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `GET /api/auth/user`: Get current user
- `POST /api/auth/register`: Register new user (admin only)

### Travels
- `GET /api/travels`: Get all travels
- `GET /api/travels/:id`: Get travel by ID
- `POST /api/travels`: Create new travel
- `PUT /api/travels/:id`: Update travel
- `DELETE /api/travels/:id`: Delete travel

### Participants
- `GET /api/participants`: Get all participants
- `GET /api/participants/:id`: Get participant by ID
- `GET /api/participants/travel/:travelId`: Get participants by travel ID
- `POST /api/participants`: Create new participant
- `PUT /api/participants/:id`: Update participant
- `DELETE /api/participants/:id`: Delete participant

### Finances
- `GET /api/finances`: Get all finances
- `GET /api/finances/:id`: Get finance by ID
- `GET /api/finances/travel/:travelId`: Get finances by travel ID
- `GET /api/finances/summary`: Get financial summary
- `POST /api/finances`: Create new finance record
- `PUT /api/finances/:id`: Update finance record
- `DELETE /api/finances/:id`: Delete finance record

### Contacts
- `GET /api/contacts`: Get all contacts
- `GET /api/contacts/:id`: Get contact by ID
- `GET /api/contacts/search`: Search contacts
- `POST /api/contacts`: Create new contact
- `PUT /api/contacts/:id`: Update contact
- `DELETE /api/contacts/:id`: Delete contact

### Admin
- `GET /api/admin/export`: Export all data (admin only)
- `GET /api/admin/export/:entity/csv`: Export specific entity as CSV (admin only)
- `GET /api/admin/stats`: Get system statistics (admin only)

## Project Structure

### Frontend Structure
```
client/
├── public/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route components
│   ├── services/      # API services
│   ├── types/         # TypeScript interfaces
│   ├── App.tsx        # Main app component
│   ├── index.tsx      # Entry point
```

### Backend Structure
```
server/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Express middleware
│   ├── models/        # Sequelize models
│   ├── routes/        # Express routes
│   ├── utils/         # Utility functions
│   ├── index.ts       # Entry point
```

## Deployment

### Backend Deployment
1. Build the TypeScript code:
```bash
npm run build
```

2. Set environment variables on your server
3. Start the server:
```bash
npm start
```

### Frontend Deployment
1. Build the React application:
```bash
npm run build
```

2. Serve the static files from the `build` directory using a web server (e.g., NGINX)

## Adding New Features

### Adding a New Model
1. Create the model file in `server/src/models/`
2. Define the model schema using Sequelize
3. Add relationships in `models/index.ts`
4. Create corresponding controllers in `server/src/controllers/`
5. Create routes in `server/src/routes/`
6. Create TypeScript interfaces in `client/src/types/`
7. Add API services in `client/src/services/api.ts`
8. Create UI components and pages

### Modifying the Database Schema
1. Update the corresponding model in `server/src/models/`
2. Migrate the database:
   - In development, you can use `sequelize.sync({ alter: true })`
   - In production, use proper migrations

## Testing
- Backend tests: Jest
- Frontend tests: React Testing Library with Jest

## Troubleshooting

### Common Issues
- Database connection issues: Check your `.env` file and ensure PostgreSQL is running
- TypeScript errors: Check your type definitions
- Module not found errors: Check your import paths 