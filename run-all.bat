@echo off
echo ========================================
echo Starting Foodie Frenzy Complete Application
echo ========================================

echo Starting backend service on port 4000...
cd backend
start "Backend" cmd /k "npm start"
cd ..

echo Starting frontend service on port 5173...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo Starting admin panel service on port 5174...
cd admin
start "Admin" cmd /k "npm run dev"
cd ..

echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo You can now access:
echo - Frontend: http://localhost:5173
echo - Admin Panel: http://localhost:5174
echo - Backend API: http://localhost:4000
echo.
echo Admin Panel Access:
echo - Login: http://localhost:5174/login
echo.
echo Press any key to exit...
pause >nul