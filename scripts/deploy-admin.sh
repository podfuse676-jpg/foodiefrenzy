#!/bin/bash

# Deployment script for Foodie Frenzy Admin Panel

echo "🚀 Starting Foodie Frenzy Admin Panel deployment process..."

# Check if we're in the right directory
if [ ! -d "admin" ]; then
  echo "❌ Error: This script must be run from the root of the FOODIEFRENZY directory"
  exit 1
fi

echo "✅ Directory structure verified"

# Update admin panel
echo "📦 Updating admin panel dependencies..."
cd admin
npm install
echo "✅ Admin panel dependencies updated"

# Build admin panel
echo "🏗️ Building admin panel..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Admin panel built successfully"
else
  echo "❌ Error: Admin panel build failed"
  exit 1
fi

cd ..

echo "🎉 Admin panel build complete!"
echo "Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Deploy to Vercel:"
echo "   - Go to Vercel Dashboard"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Set Framework Preset to 'Vite'"
echo "   - Set Root Directory to 'admin'"
echo "   - Add Environment Variable: REACT_APP_API_URL=https://lakeshoreconveniencee-backend-production.up.railway.app"
echo "   - Click 'Deploy'"