# Separate Admin Panel Solution

## Overview
This document explains how to run the frontend and admin panel as separate applications, which is the original architecture of the Foodie Frenzy application.

## Application Structure

The application consists of three separate services:
1. **Frontend** - Customer-facing application (port 5173)
2. **Admin Panel** - Administration interface (port 5174)
3. **Backend API** - Server API (port 4000)

## Running the Applications

### Using the Combined Script
1. **Using PowerShell Script**:
   ```bash
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY
   .\run-all.ps1
   ```

2. **Using Batch Script**:
   ```bash
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY
   run-all.bat
   ```

### Manual Execution
1. **Start the Backend** (required for both frontend and admin):
   ```bash
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\backend
   npm start
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\frontend
   npm run dev
   ```

3. **Start the Admin Panel** (in a new terminal):
   ```bash
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\admin
   npm run dev
   ```

## Access Points

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000

## Admin Access

To access the admin panel:
1. Visit http://localhost:5174
2. Click on "Login" to access the admin login page
3. Use admin credentials to log in

If you don't have admin credentials, you can create an admin user by visiting:
`http://localhost:4000/create-admin`

This will create an admin account with:
- Email: admin@foodiefrenzy.com
- Password: admin123

## Benefits of Separate Applications

1. **Isolation**: Frontend and admin panel are completely separate
2. **Security**: Admin panel runs on a different port
3. **Scalability**: Each application can be scaled independently
4. **Maintenance**: Updates to one application don't affect the other
5. **Deployment**: Can be deployed to different servers if needed

## Files

1. `run-all.ps1` - PowerShell script to run all services
2. `run-all.bat` - Batch script to run all services

## Troubleshooting

If you encounter issues:
1. Ensure all dependencies are installed (`npm install` in each directory)
2. Check that MongoDB is running and accessible
3. Verify that ports 4000, 5173, and 5174 are not being used by other applications
4. Check the console logs for error messages

This approach maintains the original architecture where frontend and admin panel are separate applications.