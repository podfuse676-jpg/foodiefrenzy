# Admin Panel Deployment Guide for Vercel

This guide will help you deploy the Lakeshore Convenience admin panel to Vercel.

## Prerequisites

1. GitHub account with the repository
2. Vercel account
3. Backend deployed on Render (and running)

## Environment Configuration

Your admin panel already has the correct environment configuration:

```
VITE_API_URL=https://lakeshoreconveniencee-backend.onrender.com
```

This is set in the `.env` file and will allow the admin panel to communicate with your backend.

## Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Click "New Project"

3. Import your GitHub repository

4. Set the following configuration:

   - Project Name: `foodiefrenzy-admin`
   - Framework Preset: `Vite`
   - Root Directory: `admin`

5. Add Environment Variables:

   - `VITE_API_URL`: `https://lakeshoreconveniencee-backend.onrender.com`

6. Click "Deploy"

## Verification

After deployment is complete:

1. Visit your deployed admin panel URL
2. Try logging in with admin credentials
3. Check that you can access all admin functionalities (add items, view orders, etc.)

## Troubleshooting

### If Admin Panel Doesn't Load

1. Check the Vercel deployment logs for build errors
2. Verify that the `VITE_API_URL` environment variable is set correctly
3. Check browser console for network errors

### If Admin Panel Can't Communicate with Backend

1. Verify that your backend is running on Render
2. Check that CORS is properly configured in your backend to allow requests from your admin panel URL
3. Check browser console for CORS errors

### If Login Fails

1. Verify that your backend is properly configured with the correct `ADMIN_URL` environment variable
2. Check that MongoDB connection is working
3. Check browser console for authentication errors

## Updating Deployments

To update your admin panel after making changes:

1. Push your changes to GitHub
2. Vercel will automatically redeploy
3. If auto-deploy is disabled, manually trigger a deploy from the Vercel dashboard
