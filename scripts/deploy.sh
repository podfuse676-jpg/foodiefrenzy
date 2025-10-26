#!/bin/bash

# Deployment script for Foodie Frenzy

echo "🚀 Starting Foodie Frenzy deployment process..."

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "admin" ] || [ ! -d "backend" ]; then
  echo "❌ Error: This script must be run from the root of the FOODIEFRENZY directory"
  exit 1
fi

echo "✅ Directory structure verified"

# Update all services
echo "🔄 Updating all services..."

# Update frontend
echo "📦 Updating frontend..."
cd frontend
npm install
cd ..

# Update admin
echo "📦 Updating admin..."
cd admin
npm install
cd ..

# Update backend
echo "📦 Updating backend..."
cd backend
npm install
cd ..

echo "✅ All services updated successfully"

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

# Build admin
echo "🏗️ Building admin..."
cd admin
npm run build
cd ..

echo "✅ All services built successfully"

echo "🎉 Deployment preparation complete!"
echo "Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Trigger redeployment on Vercel and Render"
echo "3. Verify that the application works correctly"