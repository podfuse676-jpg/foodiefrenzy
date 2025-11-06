# Script to deploy to Vercel

Write-Host "Preparing to deploy to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = & vercel --version
    Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Vercel CLI not found." -ForegroundColor Red
    Write-Host "Please install Vercel CLI by running: npm install -g vercel" -ForegroundColor Cyan
    Write-Host "Or visit: https://vercel.com/cli" -ForegroundColor Cyan
    exit 1
}

# Set the current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Deploy frontend
Write-Host "Deploying frontend..." -ForegroundColor Yellow
Set-Location -Path "$currentDir\frontend"
& vercel --prod

# Deploy admin panel
Write-Host "Deploying admin panel..." -ForegroundColor Yellow
Set-Location -Path "$currentDir\admin"
& vercel --prod

# Return to original directory
Set-Location -Path $currentDir

Write-Host "Deployment completed!" -ForegroundColor Green