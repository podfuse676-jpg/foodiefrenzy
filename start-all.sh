#!/bin/bash

# Script to start all Foodie Frenzy services

echo "Starting Foodie Frenzy services..."

# Start backend service
echo "Starting backend service on port 4000..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Start frontend service
echo "Starting frontend service on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Start admin service
echo "Starting admin service on port 5174..."
cd admin
npm run dev &
ADMIN_PID=$!
cd ..

echo "All services started!"
echo "Backend PID: $BACKEND_PID (http://localhost:4000)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:5173)"
echo "Admin PID: $ADMIN_PID (http://localhost:5174)"

echo ""
echo "Services are now running in the background."
echo "To stop all services, run: pkill -P $$"
echo ""
echo "You can now access:"
echo "- Frontend: http://localhost:5173"
echo "- Admin Panel: http://localhost:5174"
echo "- Backend API: http://localhost:4000"

# Wait for background processes
wait