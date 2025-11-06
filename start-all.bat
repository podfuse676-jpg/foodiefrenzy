@echo off
echo Starting Foodie Frenzy services...

REM Start backend service
echo Starting backend service on port 4000...
cd backend
start "Backend" cmd /k "npm start"
cd ..

REM Start frontend service
echo Starting frontend service on port 5173...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

REM Start admin service
echo Starting admin service on port 5174...
cd admin
start "Admin" cmd /k "npm run dev"
cd ..

echo All services started!
echo You can now access:
echo - Frontend: http://localhost:5173
echo - Admin Panel: http://localhost:5174
echo - Backend API: http://localhost:4000
echo Press any key to exit this window (services will continue running)...
pause >nul