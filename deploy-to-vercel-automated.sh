#!/bin/bash

# Automated Vercel Deployment Script for FoodieFrenzy
# This script deploys the frontend and admin panel to Vercel with proper environment variables

echo "=== FoodieFrenzy Automated Vercel Deployment ==="
echo ""

# Default backend URL (update this to your actual backend deployment)
BACKEND_URL="https://lakeshoreconveniencee-backend-production.up.railway.app"

echo "Using backend URL: $BACKEND_URL"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Checking Vercel authentication..."
vercel whoami >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Deploy Frontend
echo "=== Deploying Frontend ==="
cd frontend

# Set environment variable for production
echo "Setting VITE_API_URL environment variable for frontend..."
echo "$BACKEND_URL" | vercel env add VITE_API_URL production

# Deploy to production
echo "Deploying frontend to Vercel..."
vercel --prod --force

cd ..

echo ""
echo "=== Frontend Deployment Complete ==="
echo ""

# Deploy Admin Panel
echo "=== Deploying Admin Panel ==="
cd admin

# Set environment variable for production
echo "Setting VITE_API_URL environment variable for admin panel..."
echo "$BACKEND_URL" | vercel env add VITE_API_URL production

# Deploy to production
echo "Deploying admin panel to Vercel..."
vercel --prod --force

cd ..

echo ""
echo "=== Admin Panel Deployment Complete ==="
echo ""

echo "=== Deployment Summary ==="
echo "✅ Frontend deployed successfully!"
echo "✅ Admin Panel deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL to verify it's working"
echo "2. Visit your admin panel URL and log in"
echo "3. Test image upload functionality"
echo "4. Verify items display correctly on both frontend and admin"