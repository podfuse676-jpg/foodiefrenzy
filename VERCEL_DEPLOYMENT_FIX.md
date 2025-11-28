# Vercel Deployment Fix Guide

This document outlines the fixes needed to resolve Vercel deployment issues for the FoodieFrenzy application.

## Issues Identified

1. **Environment Variable Naming Inconsistency**:

   - Frontend uses `VITE_API_URL` but documentation sometimes refers to `REACT_APP_API_URL`
   - Admin panel missing environment file

2. **Backend CORS Configuration**:

   - CORS_ORIGIN in backend .env was set to custom domain instead of Vercel URLs
   - Missing specific Vercel deployment URLs in CORS configuration

3. **Missing Admin Environment File**:
   - Admin panel missing .env file for local development

## Fixes Applied

### 1. Updated Backend Environment Variables

**File**: `backend/.env`

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority
JWT_SECRET=4c5858c9815d0d1d1fee21d9de2c835b037803ca283b8de4e6c717ea6465a86c3f52e30b6c997d1d430dc47693e679c7231630eed810affc4d5a807b33ad3ec8

# Server Port
PORT=4000

# Frontend URL (for sitemap and robots.txt)
FRONTEND_URL=https://lakeshoreconvenience.com

# CORS Origins (updated to include Vercel URLs)
CORS_ORIGIN=https://foodiefrenzy-frontend.vercel.app,https://foodiefrenzy-admin.vercel.app

# Twilio Configuration (optional - leave empty to disable SMS functionality)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dfjypp016
CLOUDINARY_API_KEY=645785246981482
CLOUDINARY_API_SECRET=A9rs3IOJK9TEcVNUOm7Dwrg2nlI
```

### 2. Created Missing Admin Environment File

**File**: `admin/.env`

```bash
VITE_API_URL=https://lakeshoreconveniencee-backend-production.up.railway.app
```

### 3. Verified Frontend Environment Configuration

**File**: `frontend/.env` (already correct)

```bash
VITE_API_URL=https://lakeshoreconveniencee-backend-production.up.railway.app
VITE_FRONTEND_URL=https://lakeshoreconvenience.com
```

### 4. Updated Backend CORS Configuration

The CORS configuration in `backend/server.js` already includes comprehensive Vercel URL support:

```javascript
// Configure CORS with a dynamic origin function to allow all Vercel subdomains
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins from environment variable
    let allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
      "https://foodiefrenzy-frontend.vercel.app",
      "https://foodiefrenzy-admin.vercel.app",
      "https://foodiefrenzy-5hdf.vercel.app", // Add the specific admin deployment URL
      "https://foodiefrenzy-nine.vercel.app",
      "https://admin-7y4pypy16-podfuse676-6967s-projects.vercel.app",
      "https://www.lakeshoreconvenience.com", // Add custom domain
      "https://lakeshoreconvenience.com", // Add custom domain without www
      "https://admin.lakeshoreconvenience.com", // Add custom admin domain
      "https://*.lakeshore-convenience.pages.dev", // Add Cloudflare Pages wildcard
    ];

    // Add origins from CORS_ORIGIN environment variable if set
    if (process.env.CORS_ORIGIN) {
      const corsOrigins = process.env.CORS_ORIGIN.split(",").map((origin) =>
        origin.trim()
      );
      allowedOrigins = [...allowedOrigins, ...corsOrigins];
    }

    // Allow requests with no origin (like mobile apps, curl requests, or server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check if it's a Vercel subdomain
    if (origin && origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Check if it's our custom domain
    if (origin && origin.includes("lakeshoreconvenience.com")) {
      return callback(null, true);
    }

    // Check if it's a Cloudflare Pages subdomain (explicit check)
    if (origin && origin.endsWith(".lakeshore-convenience.pages.dev")) {
      return callback(null, true);
    }

    // Check if it matches any of the CORS_ORIGIN values
    if (process.env.CORS_ORIGIN) {
      const corsOrigins = process.env.CORS_ORIGIN.split(",").map((o) =>
        o.trim()
      );
      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    // Reject the request
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
```

## Deployment Instructions

### 1. Deploy Backend to Railway/Render

Ensure the backend is deployed and running with the updated environment variables.

### 2. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set Framework Preset to "Vite"
5. Set Root Directory to "frontend"
6. Add Environment Variable: `VITE_API_URL` with your backend URL
7. Click "Deploy"

### 3. Deploy Admin Panel to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set Framework Preset to "Vite"
5. Set Root Directory to "admin"
6. Add Environment Variable: `VITE_API_URL` with your backend URL
7. Click "Deploy"

## Verification Steps

1. Visit your frontend URL and verify it loads correctly
2. Check browser console for any errors
3. Try logging in to verify API connectivity
4. Visit your admin panel URL and verify it loads correctly
5. Try logging in to admin panel to verify API connectivity
6. Test image loading on both frontend and admin panel

## Troubleshooting

If issues persist:

1. Check Vercel deployment logs for build errors
2. Verify all environment variables are correctly set in Vercel dashboard
3. Check browser console for network errors
4. Verify backend is running and accessible
5. Confirm CORS configuration allows requests from your Vercel deployment URLs
