# Script to run the complete Foodie Frenzy application (Frontend + Backend)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Foodie Frenzy Complete Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Get the directory where this script is located (should be the project root)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Script directory: $scriptDir" -ForegroundColor Gray

# Start backend service
Write-Host "Starting backend service on port 4000..." -ForegroundColor Yellow
Set-Location -Path "$scriptDir\backend"
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Normal

# Start frontend service
Write-Host "Starting frontend service on port 5173..." -ForegroundColor Yellow
Set-Location -Path "$scriptDir\frontend"
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

# Start admin panel service
Write-Host "Starting admin panel service on port 5174..." -ForegroundColor Yellow
Set-Location -Path "$scriptDir\admin"
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

# Return to original directory
Set-Location -Path $scriptDir

Write-Host "========================================" -ForegroundColor Green
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now access:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "- Admin Panel: http://localhost:5174" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Panel Access:" -ForegroundColor Yellow
Write-Host "- Login: http://localhost:5174/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
pause