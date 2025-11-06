# Script to push changes to GitHub repository

Write-Host "Preparing to push changes to GitHub..." -ForegroundColor Green

# Check if Git is available
try {
    $gitVersion = & "C:\Program Files\Git\bin\git.exe" --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Git not found in standard location. Trying alternative locations..." -ForegroundColor Red
    
    # Try common Git installation paths
    $gitPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "C:\Git\bin\git.exe"
    )
    
    $gitFound = $false
    foreach ($path in $gitPaths) {
        if (Test-Path $path) {
            $script:gitCommand = $path
            $gitVersion = & $path --version
            Write-Host "Git found: $gitVersion" -ForegroundColor Yellow
            $gitFound = $true
            break
        }
    }
    
    if (-not $gitFound) {
        Write-Host "Git not found. Please install Git or add it to your PATH." -ForegroundColor Red
        Write-Host "You can download Git from: https://git-scm.com/downloads" -ForegroundColor Cyan
        exit 1
    }
} finally {
    if (-not $script:gitCommand) {
        $script:gitCommand = "git"
    }
}

# Set the current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Yellow
& $gitCommand add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
& $gitCommand commit -m "Updated social media links, menu categories, contact info, and admin panel styling"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
& $gitCommand push origin main

Write-Host "Done! Changes have been pushed to GitHub." -ForegroundColor Green
Write-Host "You can now proceed with updating Vercel." -ForegroundColor Cyan