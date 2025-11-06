# Script to push changes to GitHub and deploy to Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Foodie Frenzy Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set the current directory
$currentDir = Get-Location
Write-Host "Working directory: $currentDir" -ForegroundColor Yellow

# Function to check if a command exists
function Test-Command {
    param([string]$command)
    try {
        $null = & $command --version
        return $true
    } catch {
        return $false
    }
}

# Check for Git
Write-Host "Checking for Git..." -ForegroundColor Yellow
if (Test-Command "git") {
    $gitCommand = "git"
    Write-Host "Git found!" -ForegroundColor Green
} else {
    Write-Host "Git not found in PATH." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/downloads" -ForegroundColor Cyan
    exit 1
}

# Check for Vercel CLI
Write-Host "Checking for Vercel CLI..." -ForegroundColor Yellow
if (Test-Command "vercel") {
    Write-Host "Vercel CLI found!" -ForegroundColor Green
} else {
    Write-Host "Vercel CLI not found." -ForegroundColor Red
    Write-Host "Please install Vercel CLI by running: npm install -g vercel" -ForegroundColor Cyan
    Write-Host "Or visit: https://vercel.com/cli" -ForegroundColor Cyan
    exit 1
}

# Step 1: Push to GitHub
Write-Host "`nStep 1: Pushing changes to GitHub..." -ForegroundColor Cyan
try {
    Write-Host "Adding all changes..." -ForegroundColor Yellow
    & $gitCommand add .
    
    Write-Host "Committing changes..." -ForegroundColor Yellow
    & $gitCommand commit -m "Updated social media links, menu categories, contact info, admin panel styling, and startup scripts"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    & $gitCommand push origin main
    
    Write-Host "GitHub push completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error pushing to GitHub: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Deploy to Vercel
Write-Host "`nStep 2: Deploying to Vercel..." -ForegroundColor Cyan

# Deploy frontend
Write-Host "Deploying frontend..." -ForegroundColor Yellow
try {
    Set-Location -Path "$currentDir\frontend"
    & vercel --prod --confirm
    Write-Host "Frontend deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error deploying frontend: $_" -ForegroundColor Red
}

# Deploy admin panel
Write-Host "Deploying admin panel..." -ForegroundColor Yellow
try {
    Set-Location -Path "$currentDir\admin"
    & vercel --prod --confirm
    Write-Host "Admin panel deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error deploying admin panel: $_" -ForegroundColor Red
}

# Return to original directory
Set-Location -Path $currentDir

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deployment Process Completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend URL: Your Vercel frontend URL" -ForegroundColor Yellow
Write-Host "Admin Panel URL: Your Vercel admin panel URL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan