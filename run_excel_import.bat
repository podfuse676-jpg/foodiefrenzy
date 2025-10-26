@echo off
echo Foodie Frenzy Excel Import Script
echo ================================
echo.
echo This script will process your Excel files and import the data into the database.
echo.
echo Prerequisites:
echo - MongoDB must be running
echo - Node.js must be installed
echo - Python must be installed
echo.
pause
echo.
echo Changing to backend directory...
cd /d "c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\backend"
echo.
echo Running Excel import script...
node importFromExcel.js
echo.
echo Import process completed.
echo.
pause