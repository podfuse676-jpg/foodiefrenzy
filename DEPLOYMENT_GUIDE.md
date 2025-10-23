# Foodie Frenzy Deployment Guide

This guide will help you deploy the Foodie Frenzy application to Vercel (frontend and admin) and Render (backend).

## Prerequisites

1. GitHub account with the repository
2. Vercel account
3. Render account
4. MongoDB Atlas account
5. (Optional) Stripe account for payments

## Backend Deployment on Render

### 1. Update Environment Variables

Make sure your `.env` file in the backend has the correct values:

```
JWT_SECRET=your_jwt_secret_here_(at_least_32_characters)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
FRONTEND_URL=https://foodiefrenzy-frontend.vercel.app
ADMIN_URL=https://foodiefrenzy-admin.vercel.app
NODE_ENV=production
TWILIO_ACCOUNT_SID= (leave empty if not using SMS)
TWILIO_AUTH_TOKEN= (leave empty if not using SMS)
TWILIO_PHONE_NUMBER= (leave empty if not using SMS)
TWILIO_VERIFIED_NUMBER= (leave empty if not using SMS)
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=4000
CORS_ORIGIN=https://foodiefrenzy-frontend.vercel.app
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set the following:
   - Name: `foodiefrenzy-backend`
   - Region: Choose the closest region
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (copy from your `.env` file)
6. Click "Create Web Service"

### 3. Update MongoDB Atlas IP Whitelist

After deployment, get the Render service IP and add it to your MongoDB Atlas IP whitelist:

1. In Render, go to your service → Settings → IP Address
2. Copy the IP address
3. In MongoDB Atlas, go to Network Access → Add IP Address
4. Add the Render IP address

## Frontend Deployment on Vercel

### 1. Update Environment Variables

Make sure your `.env` file in the frontend has the correct value:

```
REACT_APP_API_URL=https://your-render-service-url.onrender.com
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following:
   - Project Name: `foodiefrenzy-frontend`
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
5. Add Environment Variables (copy from your `.env` file)
6. Click "Deploy"

## Admin Panel Deployment on Vercel

### 1. Update Environment Variables

Make sure your `.env` file in the admin has the correct value:

```
REACT_APP_API_URL=https://your-render-service-url.onrender.com
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following:
   - Project Name: `foodiefrenzy-admin`
   - Framework Preset: `Vite`
   - Root Directory: `admin`
5. Add Environment Variables (copy from your `.env` file)
6. Click "Deploy"

## Deploying Services Independently

If you want to deploy each service separately, you can use the specific deployment guides:

- [Admin Panel Deployment Guide](ADMIN_DEPLOYMENT_GUIDE.md) - For deploying only the admin panel
- Frontend Deployment Guide (this document) - For deploying only the frontend
- Backend Deployment (this document) - For deploying only the backend

Each service can be deployed and updated independently without affecting the others.

## Troubleshooting

### Login Issues

If you're unable to log in on Vercel:

1. Check that `REACT_APP_API_URL` in your frontend `.env` file points to your Render backend URL
2. Check that CORS is properly configured in your backend
3. Check browser console for network errors
4. Make sure your MongoDB connection is working

### MongoDB Connection Issues

If your backend fails to connect to MongoDB:

1. Verify your `MONGODB_URI` is correct
2. Make sure your MongoDB Atlas cluster allows connections from Render IPs
3. You may need to whitelist `0.0.0.0/0` for testing purposes

### Twilio Issues

If you don't want to use Twilio for SMS:

1. Leave the Twilio environment variables empty
2. The application will work without SMS functionality

## Updating Deployments

To update your deployments after making changes:

1. Push your changes to GitHub
2. Vercel and Render will automatically redeploy
3. For Render, you may need to manually trigger a deploy if auto-deploy is disabled
