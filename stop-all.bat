@echo off
echo Stopping Foodie Frenzy services...

REM Kill all Node.js processes (this will stop all running services)
taskkill /f /im node.exe

echo All services stopped!
pause