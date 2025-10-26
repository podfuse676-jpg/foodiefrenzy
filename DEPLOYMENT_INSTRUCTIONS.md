# Foodie Frenzy Deployment Instructions

This document provides instructions on how to push your changes to GitHub and deploy to Vercel.

## Prerequisites

Before running the deployment scripts, ensure you have:

1. **Git** installed and configured
2. **Vercel CLI** installed
3. **Node.js** installed (for running the applications)

### Installing Prerequisites

#### Git
If Git is not installed:
1. Download from: https://git-scm.com/downloads
2. Install with default settings
3. Restart your terminal/command prompt

#### Vercel CLI
To install Vercel CLI:
```bash
npm install -g vercel
```

## Deployment Scripts

This project includes three PowerShell scripts to help with deployment:

1. **push-to-github.ps1** - Pushes changes to GitHub
2. **deploy-to-vercel.ps1** - Deploys to Vercel
3. **deploy-all.ps1** - Does both steps above

## Running the Deployment

### Method 1: Run the Combined Script (Recommended)

1. Open PowerShell as Administrator
2. Navigate to the project directory:
   ```powershell
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY
   ```
3. Run the deployment script:
   ```powershell
   .\deploy-all.ps1
   ```

### Method 2: Run Batch Files (Alternative)

If PowerShell scripts don't work, you can use the batch files instead:

1. Double-click on `deploy-all.bat` to run the complete deployment
2. Or run individual batch files:
   - `push-to-github.bat` - Push changes to GitHub
   - `deploy-to-vercel.bat` - Deploy to Vercel

### Method 3: Run Individual Scripts

1. **Push to GitHub:**
   ```powershell
   .\push-to-github.ps1
   ```

2. **Deploy to Vercel:**
   ```powershell
   .\deploy-to-vercel.ps1
   ```

## Manual Deployment (If Scripts Don't Work)

If the scripts don't work, you can manually deploy using these commands:

### Push to GitHub
```bash
cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY
git add .
git commit -m "Updated social media links, menu categories, contact info, admin panel styling, and startup scripts"
git push origin main
```

### Deploy to Vercel
```bash
# Deploy frontend
cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\frontend
vercel --prod

# Deploy admin panel
cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\admin
vercel --prod
```

### Using Batch Files
Alternatively, you can double-click on the batch files:
- `push-to-github.bat` - Pushes all changes to GitHub
- `deploy-to-vercel.bat` - Deploys both frontend and admin panel to Vercel
- `deploy-all.bat` - Does both steps above

## Troubleshooting

### Git Issues
- If you get "git is not recognized", you need to install Git:
  1. Download from: https://git-scm.com/downloads
  2. Install with default settings
  3. Restart your terminal/command prompt
  4. Add Git to your PATH environment variable if needed
- If you get permission errors, make sure you have write access to the repository

### Vercel Issues
- If you get "vercel is not recognized", make sure Vercel CLI is installed globally
- If you get authentication errors, run `vercel login` first

## What Was Updated

The following changes have been made to your project:

1. **Social Media Links** - Updated with real Facebook and Instagram URLs
2. **Menu Categories** - Reorganized to: Products, Hot Beverages, Cold Beverages, Hot Food, Exotic Chips, Exotic Drinks, Grocery, Novelties
3. **Contact Information** - Updated with real address, phone number, and email
4. **Admin Panel Styling** - Synchronized colors with frontend
5. **Image Handling** - Added Unsplash API integration for menu items
6. **Startup Scripts** - Added scripts to easily run services in background

## Accessing Your Deployed Applications

After successful deployment, Vercel will provide you with URLs for:
- Frontend application
- Admin panel

These URLs will be displayed in the terminal output after deployment.