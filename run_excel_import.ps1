# Foodie Frenzy Excel Import Script
# ================================
# This script will process your Excel files and import the data into the database.

Write-Host "Foodie Frenzy Excel Import Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will process your Excel files and import the data into the database."
Write-Host ""
Write-Host "Prerequisites:" -ForegroundColor Yellow
Write-Host "- MongoDB must be running" -ForegroundColor Yellow
Write-Host "- Node.js must be installed" -ForegroundColor Yellow
Write-Host "- Python must be installed" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Changing to backend directory..." -ForegroundColor Cyan
Set-Location -Path "c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\backend"

Write-Host ""
Write-Host "Running Excel import script..." -ForegroundColor Cyan
node importFromExcel.js

Write-Host ""
Write-Host "Import process completed." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")