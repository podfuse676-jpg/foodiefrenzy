@echo off
echo ========================================
echo Starting Foodie Frenzy Complete Application
echo ========================================

echo Starting backend service on port 4000...
cd /d "c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\backend"
start "Backend" cmd /k "node server.js"

echo Starting frontend service on port 5173...
cd /d "c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\frontend"
start "Frontend" cmd /k "npm run dev"

echo Starting admin panel service on port 5174...
cd /d "c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\admin"
start "Admin" cmd /k "npm run dev"

echo ========================================
echo All services started successfully!
echo ========================================
echo You can now access:
echo - Frontend: http://localhost:5173
echo - Admin Panel: http://localhost:5174
echo - Backend API: http://localhost:4000
echo Admin Panel Access:
echo - Login: http://localhost:5174/login
echo Press any key to exit...
pause