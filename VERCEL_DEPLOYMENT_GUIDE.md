# Vercel Deployment Guide

This guide explains how to deploy the FoodieFrenzy application to Vercel without Cloudinary dependencies.

## Prerequisites

1. Vercel account (free tier available)
2. GitHub account (recommended for automatic deployments)
3. Backend deployed and accessible (Railway, Render, or other hosting)

## Deployment Steps

### 1. Frontend Deployment

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository or upload the frontend folder
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend-url.up.railway.app`)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

3. Deploy:

   ```bash
   vercel --prod
   ```

4. When prompted:

   - Set up and deploy? `Y`
   - Which scope? Select your team/personal account
   - Link to existing project? `N`
   - What's your project's name? `foodiefrenzy-frontend`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. Add environment variables:
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL when prompted
   ```

### 2. Admin Panel Deployment

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository or upload the admin folder
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (same as frontend)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Navigate to admin directory:

   ```bash
   cd admin
   ```

2. Deploy:

   ```bash
   vercel --prod
   ```

3. When prompted:

   - Set up and deploy? `Y`
   - Which scope? Select your team/personal account
   - Link to existing project? `N`
   - What's your project's name? `foodiefrenzy-admin`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

4. Add environment variables:
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL when prompted
   ```

### 3. Backend Deployment (Optional - if moving from Railway)

If you want to move the backend to a Vercel-compatible hosting:

1. The backend can be deployed to Railway, Render, or similar services
2. Ensure the `uploads/images/` directory is writable
3. Set the appropriate environment variables (excluding Cloudinary)

## Environment Variables Required

### Frontend & Admin Panel

- `VITE_API_URL`: Your backend deployment URL

Example:

```
VITE_API_URL=https://your-backend-deployment.up.railway.app
```

## Post-Deployment Verification

1. Visit your frontend URL
2. Check that the site loads correctly
3. Navigate to the menu page to verify items load
4. Visit your admin panel URL
5. Log in and verify you can see items
6. Test image upload functionality

## Troubleshooting

### Common Issues

1. **API Connection Errors**

   - Verify `VITE_API_URL` is set correctly
   - Ensure backend is running and accessible
   - Check CORS configuration in backend

2. **Image Loading Issues**

   - Verify backend can serve images from `/uploads/images/`
   - Check that the uploads directory is writable
   - Ensure proper URL construction in backend

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors in code

### Checking Deployment Logs

1. In Vercel Dashboard, go to your project
2. Click on "Deployments" tab
3. Select the latest deployment
4. Click "View Logs" to see build and deployment logs

## Redeployment

For automatic redeployments:

1. Push changes to your GitHub repository
2. Vercel will automatically detect changes and redeploy
3. Or manually trigger deployment from Vercel Dashboard

For manual redeployment:

```bash
# Frontend
cd frontend
vercel --prod

# Admin
cd admin
vercel --prod
```

## Monitoring

1. Set up uptime monitoring for your backend
2. Monitor Vercel analytics for frontend performance
3. Check error logs regularly
4. Monitor bandwidth usage (especially for image-heavy sites)

This deployment approach eliminates Cloudinary dependencies and uses Vercel for both frontend and admin panel hosting, with a separate backend deployment.
