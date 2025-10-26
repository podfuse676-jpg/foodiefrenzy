# Script to start all Foodie Frenzy services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Foodie Frenzy Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Script directory: $scriptDir" -ForegroundColor Gray

# Function to start a service
function Start-ServiceProcess {
    param(
        [string]$ServiceName,
        [string]$Directory,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    # Change to the service directory
    Set-Location -Path "$scriptDir\$Directory"
    
    # Start the process
    $process = Start-Process -FilePath "cmd" -ArgumentList "/c $Command" -WindowStyle Minimized -PassThru
    
    Write-Host "$ServiceName started with PID: $($process.Id)" -ForegroundColor Green
    return $process
}

# Start all services
try {
    # Start backend service
    $backendProcess = Start-ServiceProcess -ServiceName "Backend API" -Directory "backend" -Command "node server.js" -Port 4000
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 3
    
    # Start frontend service
    $frontendProcess = Start-ServiceProcess -ServiceName "Frontend" -Directory "frontend" -Command "npm run dev" -Port 5173
    
    # Wait a moment for frontend to start
    Start-Sleep -Seconds 3
    
    # Start admin panel service
    $adminProcess = Start-ServiceProcess -ServiceName "Admin Panel" -Directory "admin" -Command "npm run dev" -Port 5174
    
    # Return to script directory
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
    Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow
    
    # Keep the script running
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "Error starting services: $_" -ForegroundColor Red
}