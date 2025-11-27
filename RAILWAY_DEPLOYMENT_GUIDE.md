# Railway Deployment Guide for Foodie Frenzy Backend

This guide will help you deploy your Foodie Frenzy backend to Railway instead of Render.

## Prerequisites

1. A Railway account (https://railway.app/)
2. A GitHub account with your repository
3. Your MongoDB credentials
4. Your Cloudinary account credentials
5. Your Stripe account credentials

## Deploying to Railway

### Step 1: Connect Your Repository to Railway

1. Log in to your Railway account
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your Foodie Frenzy repository

### Step 2: Configure the Service

Railway should automatically detect your configuration from the `railway.json` file:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Step 3: Set Environment Variables

Railway will automatically use the variables from your [.env.railway](backend/.env.railway) file, but you can also set them manually in the Railway dashboard:

1. Go to your Railway project
2. Click on your service
3. Go to the "Variables" tab
4. Add the following environment variables:

```
MONGODB_URI=mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority
JWT_SECRET=cefa5906a5fc476696d4b5f508fd42e2eac737d44adfcc42ca17c600658e58d7c6ed9875fb4270bb91e9b26dfe30cfc67b0f2cb7664acc1d400ce8e56c615ae7
PORT=4000
FRONTEND_URL=https://lakeshoreconvenience.com
ADMIN_URL=https://admin.lakeshoreconvenience.com
CORS_ORIGIN=https://lakeshoreconvenience.com
STRIPE_SECRET_KEY=sk_test_51Rr20x1e1XYDeZ9dUx1XaKUnyH61PMLi6mpP1SGzfUgllugXSJ9NOoKOXK9Zj7mEJJ80NAEBhBfwUPZuCg1ngWd500S6REKOVk
CLOUDINARY_CLOUD_NAME=dfjypp016
CLOUDINARY_API_KEY=645785246981482
CLOUDINARY_API_SECRET=A9rs3IOJK9TEcVNUOm7Dwrg2nlI
```

### Step 4: Configure Custom Domains (Optional)

If you want to use a custom domain:

1. In your Railway project, go to "Settings"
2. Click "Custom Domains"
3. Add your domain (e.g., `api.lakeshoreconvenience.com`)
4. Follow Railway's instructions to configure DNS records

### Step 5: Deploy

1. Railway will automatically start building and deploying your application
2. Wait for the deployment to complete (this may take a few minutes)

### Step 6: Update Frontend and Admin Panel

After deployment, you'll need to update your frontend and admin panel to point to the new Railway backend URL:

1. Get your Railway service URL from the Railway dashboard (it will look something like `your-service.up.railway.app`)
2. Update the following files:

**For Frontend** (`frontend/.env.production`):

```
VITE_API_URL=https://your-service.up.railway.app
VITE_FRONTEND_URL=https://lakeshoreconvenience.com
```

**For Admin Panel** (`admin/.env.production`):

```
VITE_API_URL=https://your-service.up.railway.app
```

3. Redeploy your frontend and admin panel to Vercel

## Benefits of Railway over Render

1. **No Sleep Issues**: Railway's free tier doesn't put your application to sleep like Render's free tier
2. **Better Performance**: More consistent response times
3. **Easy Scaling**: Simple upgrade path to paid plans
4. **Good Integration**: Seamless GitHub integration and automated deployments

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check the build logs in Railway for specific error messages
2. **Application crashes**: Check the application logs in Railway
3. **Database connection issues**: Verify your MongoDB URI is correct
4. **Environment variables not set**: Double-check all environment variables in the Railway dashboard

### Checking Logs

1. Go to your Railway project
2. Click on your service
3. Click "Logs" to view real-time application logs

### Health Check

Once deployed, test the health endpoint:
`https://your-service.up.railway.app/health`

You should receive a response like:

```json
{
  "status": "OK",
  "port": 4000,
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
}
```
