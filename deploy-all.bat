@echo off
echo ========================================
echo Foodie Frenzy - Complete Deployment
echo ========================================

echo.
echo This script will:
echo 1. Push changes to GitHub
echo 2. Deploy to Vercel
echo.

echo Please make sure:
echo - Git is installed and in your PATH
echo - Vercel CLI is installed (npm install -g vercel)
echo.

pause

echo ========================================
echo Step 1: Pushing to GitHub
echo ========================================

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Updated social media links, menu categories, contact info, admin panel styling, and startup scripts"

echo Pushing to GitHub...
git push origin main

echo.
echo GitHub push completed!
echo.

echo ========================================
echo Step 2: Deploying to Vercel
echo ========================================

echo Deploying frontend...
cd frontend
vercel --prod --confirm
cd ..

echo.
echo Deploying admin panel...
cd admin
vercel --prod --confirm
cd ..

echo.
echo ========================================
echo Deployment Process Completed!
echo ========================================
echo.
echo Frontend URL: Your Vercel frontend URL
echo Admin Panel URL: Your Vercel admin panel URL
echo.
pause