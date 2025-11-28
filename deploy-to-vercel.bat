@echo off
title FoodieFrenzy Vercel Deployment

echo === FoodieFrenzy Vercel Deployment Script ===
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI could not be found
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Prompt for backend URL
set /p BACKEND_URL="Please enter your backend URL (e.g., https://your-backend.up.railway.app): "

if "%BACKEND_URL%"=="" (
    echo Backend URL is required. Exiting.
    pause
    exit /b 1
)

echo.
echo Backend URL set to: %BACKEND_URL%
echo.

REM Deploy Frontend
echo === Deploying Frontend ===
cd frontend

REM Set environment variable
echo Setting VITE_API_URL environment variable...
echo %BACKEND_URL% | vercel env add VITE_API_URL production

REM Deploy to production
echo Deploying frontend to Vercel...
vercel --prod --confirm

cd ..

echo.
echo === Frontend Deployment Complete ===
echo.

REM Deploy Admin Panel
echo === Deploying Admin Panel ===
cd admin

REM Set environment variable
echo Setting VITE_API_URL environment variable...
echo %BACKEND_URL% | vercel env add VITE_API_URL production

REM Deploy to production
echo Deploying admin panel to Vercel...
vercel --prod --confirm

cd ..

echo.
echo === Admin Panel Deployment Complete ===
echo.

echo === Deployment Summary ===
echo Frontend deployed successfully!
echo Admin Panel deployed successfully!
echo.
echo Next steps:
echo 1. Visit your frontend URL to verify it's working
echo 2. Visit your admin panel URL and log in
echo 3. Test image upload functionality
echo 4. Verify items display correctly on both frontend and admin
echo.

pause