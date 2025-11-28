#!/bin/bash

echo "=== Debugging Vercel Deployment ==="
echo "Current directory: $(pwd)"
echo "Git status:"
git status

echo -e "\n=== Checking latest commits ==="
git log --oneline -5

echo -e "\n=== Checking if Vercel CLI is installed ==="
if command -v vercel &> /dev/null; then
    echo "Vercel CLI is installed: $(vercel --version)"
else
    echo "Vercel CLI is not installed"
fi

echo -e "\n=== Checking environment variables ==="
if [ -f .env.production ]; then
    echo ".env.production exists:"
    grep -v "^#" .env.production | grep -E "VITE_" | head -5
else
    echo ".env.production does not exist"
fi

echo -e "\n=== Checking build directory ==="
if [ -d dist ]; then
    echo "dist directory exists with $(ls -1 dist | wc -l) items"
    echo "dist/assets contents:"
    ls -1 dist/assets | head -10
else
    echo "dist directory does not exist"
fi

echo -e "\n=== Checking Vercel configuration ==="
if [ -f vercel.json ]; then
    echo "vercel.json exists:"
    cat vercel.json
else
    echo "vercel.json does not exist"
fi

echo -e "\n=== Checking .vercel directory ==="
if [ -d .vercel ]; then
    echo ".vercel directory exists:"
    ls -la .vercel/
else
    echo ".vercel directory does not exist"
fi

echo -e "\n=== Testing API connection ==="
echo "Testing backend health endpoint:"
curl -s -m 10 "https://lakeshoreconveniencee-backend-production.up.railway.app/health" || echo "Failed to reach backend health endpoint"

echo -e "\nTesting backend items endpoint:"
curl -s -m 10 "https://lakeshoreconveniencee-backend-production.up.railway.app/api/items" | head -200 | grep -o "imageUrl.*https://res.cloudinary.com[^,}]*" | head -3 || echo "Failed to reach backend items endpoint or no Cloudinary URLs found"

echo -e "\n=== Debug complete ==="