# Deployment Guide for Foodie Frenzy Application

## Prerequisites

1. A Render account (https://render.com/) OR a Railway account (https://railway.app/)
2. A GitHub account with the repository connected to Render/Railway
3. Your Cloudinary account credentials
4. Your Stripe account credentials (for payment processing)

## Deploying to Render (Option 1 - Traditional)

### Step 1: Connect Your Repository to Render

1. Log in to your Render account
2. Click "New" and select "Web Service"
3. Connect your GitHub account if not already connected
4. Select your Foodie Frenzy repository

### Step 2: Configure the Web Service

Render should automatically detect your configuration from the `render.yaml` file:

- **Name**: lakeshoreconveniencee-backend
- **Environment**: Node
- **Build Command**: npm install
- **Start Command**: node server.js
- **Plan**: Free (you can upgrade later if needed)

### Step 3: Set Environment Variables

The following environment variables are already configured in your `render.yaml` file:

- `NODE_ENV`: production
- `PORT`: 10000
- `MONGODB_URI`: Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`: dfjypp016
- `CLOUDINARY_API_KEY`: 645785246981482
- `CLOUDINARY_API_SECRET`: A9rs3IOJK9TEcVNUOm7Dwrg2nlI
- `JWT_SECRET`: Your JWT secret

**Important**: You need to update the following environment variables with your actual values:

1. **MONGODB_URI**: Your actual MongoDB connection string
2. **JWT_SECRET**: A secure JWT secret (you can generate one using the provided script)
3. **STRIPE_SECRET_KEY**: Your actual Stripe secret key (see instructions below)

### Stripe Configuration

To enable payment processing, you need to configure your Stripe secret key:

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Secret key" (starts with sk*test* for test mode or sk*live* for live mode)
3. In the Render dashboard, add a new environment variable:
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your actual Stripe secret key

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying your application
3. Wait for the deployment to complete (this may take a few minutes)

### Step 5: Verify Deployment

1. Once deployed, visit your service URL (should be something like `https://lakeshoreconveniencee-backend.onrender.com`)
2. Test the health endpoint: `https://lakeshoreconveniencee-backend.onrender.com/health`
3. Test the items endpoint: `https://lakeshoreconveniencee-backend.onrender.com/api/items`

## Deploying to Railway (Option 2 - Recommended)

For a better experience without sleep issues, we recommend using Railway instead of Render. Follow the detailed [Railway Deployment Guide](RAILWAY_DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## Updating Environment Variables in Render Dashboard

If you need to update any environment variables after deployment:

1. Go to your Render dashboard
2. Click on your service
3. Click "Environment" in the sidebar
4. Add or modify variables as needed
5. Click "Save Changes" to redeploy with new variables

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check the build logs in Render for specific error messages
2. **Application crashes**: Check the application logs in Render
3. **Database connection issues**: Verify your MongoDB URI is correct
4. **Cloudinary issues**: Verify your Cloudinary credentials are correct
5. **Stripe issues**: Verify your Stripe secret key is correct and properly formatted
