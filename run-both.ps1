# Script to run both frontend and admin panel

Write-Host "Starting Foodie Frenzy Frontend and Admin Panel..." -ForegroundColor Green

# Get the current directory
$currentDir = Get-Location

# Start frontend service
Write-Host "Starting frontend service on port 5173..." -ForegroundColor Yellow
Set-Location -Path "$currentDir\frontend"
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

# Start admin service
Write-Host "Starting admin service on port 5174..." -ForegroundColor Yellow
Set-Location -Path "$currentDir\admin"
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

# Return to original directory
Set-Location -Path $currentDir

Write-Host "Services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now access:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "- Admin Panel: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
pause