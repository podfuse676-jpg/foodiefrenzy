@echo off
echo ========================================
echo Foodie Frenzy - Push to GitHub
echo ========================================

echo.
echo Please make sure Git is installed and in your PATH.
echo If you get errors, please install Git from https://git-scm.com/downloads
echo.

pause

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Updated social media links, menu categories, contact info, admin panel styling, and startup scripts"

echo Pushing to GitHub...
git push origin main

echo.
echo Push to GitHub completed!
echo.
pause