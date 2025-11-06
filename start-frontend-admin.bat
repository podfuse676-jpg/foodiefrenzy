@echo off
echo Starting Foodie Frenzy Frontend and Admin Panel...

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

echo Services started successfully!
echo.
echo You can now access:
echo - Frontend: http://localhost:5173
echo - Admin Panel: http://localhost:5174
echo.
echo To stop these services, close the command prompt windows that opened,
echo or run stop-all.bat to stop all Node.js processes.
echo.
pause