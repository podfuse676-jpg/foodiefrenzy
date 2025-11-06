@echo off
echo ========================================
echo Foodie Frenzy - Deploy to Vercel
echo ========================================

echo.
echo Please make sure Vercel CLI is installed.
echo If you get errors, please install Vercel CLI by running: npm install -g vercel
echo.

pause

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
echo Deployment completed!
echo.
pause