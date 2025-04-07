# Travel Management System

A comprehensive management system for travel experience businesses to track participants, travels, cost centers, cashflow, and financial statements.

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access control (admin/user)
  - JWT token authentication

- **Travel Management**
  - Create and manage travel packages
  - Track travel status (planned/ongoing/completed/cancelled)
  - Calculate commissions and total fees
  - Associate agency information

- **Participant Management**
  - Register participants for travels
  - Track payment status
  - Manage participant details and communications
  - Filter and sort participants by various criteria

- **Financial Management**
  - Record incomes and expenses
  - Associate finances with specific travels
  - Generate financial summaries and reports
  - Track participant payments

- **Contact Management**
  - Store and manage contact information
  - Associate contacts with organizations
  - Add notes and track interactions
  - Search and filter contacts

- **Admin Features**
  - Data export to CSV format
  - System statistics and monitoring
  - User management
  - Bulk data operations

- **User Experience**
  - Responsive design for all devices
  - Rich data visualization with charts
  - Modern, intuitive interface
  - Quick search and filtering capabilities

## Project Structure

This project is built as a full-stack application with separate frontend and backend components:

### Frontend (Client)

- Built with React + TypeScript
- Material UI for the user interface
- Charts and data visualization
- Responsive design for all devices

### Backend (Server)

- Node.js + Express.js REST API
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Role-based access control

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- PostgreSQL database

### Installation

#### Using Installation Scripts (Recommended)

1. Clone the repository:
```
git clone <repository-url>
cd travel-management
```

2. Run the installation script:
   - Windows: Double-click `install.bat` or run it from Command Prompt
   - Mac/Linux: 
   ```
   chmod +x install.sh
   ./install.sh
   ```

3. Update the database credentials in the `.env` file created in the server directory

4. Set up the database and sample data:
```
cd server
npm run setup
```

5. Start the development servers:
```
# Start the backend server
cd travel-management/server
npm run dev

# Start the frontend client (in a new terminal)
cd travel-management/client
npm start
```

#### Manual Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies for both client and server:
```
# Install client dependencies
cd travel-management/client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure the database:
   - Create a PostgreSQL database named `travel_management`
   - Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   DB_NAME=travel_management
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```

4. Start the development servers:
```
# Start the backend server
cd travel-management/server
npm run dev

# Start the frontend client (in a new terminal)
cd travel-management/client
npm start
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Installation (Alternative)

For a containerized development setup:

1. Clone the repository:
```
git clone <repository-url>
cd travel-management
```

2. Create a `.env` file in the project root with database credentials:
```
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=travel_management
JWT_SECRET=your_secret_key
```

3. Start the Docker containers:
```
docker-compose -f docker-compose.dev.yml up
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## User Guide

### Login Credentials

After seeding the database, you can use the following credentials:
- Admin user: username: `admin`, password: `password`
- Regular user: username: `user`, password: `password`

### Features by Role

#### Admin (Full Access)
- View and manage all travels, participants, finances, and contacts
- Export and import data
- Monitor user activity
- Manage user accounts

#### Regular User
- View and manage assigned travels, participants, and contacts
- Limited access to financial data

## Developer Documentation

For detailed developer documentation, including API endpoints, database schema, and development guidelines, see [DEVELOPER.md](DEVELOPER.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details. 