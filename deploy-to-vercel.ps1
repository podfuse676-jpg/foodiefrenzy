# Vercel Deployment Script for FoodieFrenzy
# This script deploys the frontend and admin panel to Vercel

Write-Host "=== FoodieFrenzy Vercel Deployment Script ===" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI could not be found" -ForegroundColor Yellow
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Prompt for backend URL
$BACKEND_URL = Read-Host "Please enter your backend URL (e.g., https://your-backend.up.railway.app)"

if ([string]::IsNullOrEmpty($BACKEND_URL)) {
    Write-Host "Backend URL is required. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Backend URL set to: $BACKEND_URL" -ForegroundColor Green
Write-Host ""

# Deploy Frontend
Write-Host "=== Deploying Frontend ===" -ForegroundColor Cyan
Set-Location -Path "frontend"

# Set environment variable
Write-Host "Setting VITE_API_URL environment variable..." -ForegroundColor Yellow
echo $BACKEND_URL | vercel env add VITE_API_URL production

# Deploy to production
Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
vercel --prod --confirm

Set-Location -Path ".."

Write-Host ""
Write-Host "=== Frontend Deployment Complete ===" -ForegroundColor Green
Write-Host ""

# Deploy Admin Panel
Write-Host "=== Deploying Admin Panel ===" -ForegroundColor Cyan
Set-Location -Path "admin"

# Set environment variable
Write-Host "Setting VITE_API_URL environment variable..." -ForegroundColor Yellow
echo $BACKEND_URL | vercel env add VITE_API_URL production

# Deploy to production
Write-Host "Deploying admin panel to Vercel..." -ForegroundColor Yellow
vercel --prod --confirm

Set-Location -Path ".."

Write-Host ""
Write-Host "=== Admin Panel Deployment Complete ===" -ForegroundColor Green
Write-Host ""

Write-Host "=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Frontend deployed successfully!" -ForegroundColor Green
Write-Host "Admin Panel deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit your frontend URL to verify it's working" -ForegroundColor White
Write-Host "2. Visit your admin panel URL and log in" -ForegroundColor White
Write-Host "3. Test image upload functionality" -ForegroundColor White
Write-Host "4. Verify items display correctly on both frontend and admin" -ForegroundColor White