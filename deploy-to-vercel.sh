#!/bin/bash

# Vercel Deployment Script for FoodieFrenzy
# This script deploys the frontend and admin panel to Vercel

echo "=== FoodieFrenzy Vercel Deployment Script ==="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Prompt for backend URL
echo "Please enter your backend URL (e.g., https://your-backend.up.railway.app):"
read BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "Backend URL is required. Exiting."
    exit 1
fi

echo ""
echo "Backend URL set to: $BACKEND_URL"
echo ""

# Deploy Frontend
echo "=== Deploying Frontend ==="
cd frontend

# Set environment variable
echo "Setting VITE_API_URL environment variable..."
vercel env add VITE_API_URL production <<< "$BACKEND_URL"

# Deploy to production
echo "Deploying frontend to Vercel..."
vercel --prod --confirm

cd ..

echo ""
echo "=== Frontend Deployment Complete ==="
echo ""

# Deploy Admin Panel
echo "=== Deploying Admin Panel ==="
cd admin

# Set environment variable
echo "Setting VITE_API_URL environment variable..."
vercel env add VITE_API_URL production <<< "$BACKEND_URL"

# Deploy to production
echo "Deploying admin panel to Vercel..."
vercel --prod --confirm

cd ..

echo ""
echo "=== Admin Panel Deployment Complete ==="
echo ""

echo "=== Deployment Summary ==="
echo "Frontend deployed successfully!"
echo "Admin Panel deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL to verify it's working"
echo "2. Visit your admin panel URL and log in"
echo "3. Test image upload functionality"
echo "4. Verify items display correctly on both frontend and admin"