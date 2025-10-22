# Foodie Frenzy - Deployment Instructions

This document provides step-by-step instructions for deploying the Foodie Frenzy application to free hosting platforms.

## Prerequisites

Before starting the deployment process, you'll need:

1. GitHub account
2. MongoDB Atlas account
3. Render.com account
4. Netlify account

## Step 1: Set up MongoDB Atlas

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Deploy a free cluster (M0 Sandbox tier)
4. Create a database user:
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username and secure password
   - Grant "Read and write to any database" permissions
5. Configure network access:
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Add "0.0.0.0/0" to allow connections from anywhere (for development)
6. Get your connection string:
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

## Step 2: Prepare Backend for Deployment

1. Update the `.env` file in the backend directory with your MongoDB connection string and other credentials
2. The backend is already configured to use `node server.js` for production deployment

## Step 3: Deploy Backend to Render

1. Push your code to a GitHub repository
2. Sign up at [Render](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: foodiefrenzy-backend
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in the Render dashboard:
   - MONGO_URI: Your MongoDB Atlas connection string
   - JWT_SECRET: A secure random string
   - Other required environment variables
7. Deploy the service

## Step 4: Update Environment Variables for Frontend and Admin

Create `.env.production` files in both frontend and admin directories:

### Frontend .env.production

```env
REACT_APP_API_URL=https://your-render-app-name.onrender.com
REACT_APP_FRONTEND_URL=https://your-frontend.netlify.app
REACT_APP_ADMIN_URL=https://your-admin.netlify.app
NODE_ENV=production
```

### Admin .env.production

```env
REACT_APP_API_URL=https://your-render-app-name.onrender.com
REACT_APP_FRONTEND_URL=https://your-frontend.netlify.app
REACT_APP_ADMIN_URL=https://your-admin.netlify.app
NODE_ENV=production
```

## Step 5: Deploy Frontend to Netlify

1. Sign up at [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure the deployment:
   - Branch: main (or your default branch)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`
5. Add environment variables in the Netlify dashboard
6. Deploy the site

## Step 6: Deploy Admin Panel to Netlify

1. In Netlify, create another new site
2. Connect the same GitHub repository
3. Configure the deployment:
   - Branch: main (or your default branch)
   - Base directory: `admin`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in the Netlify dashboard
5. Deploy the site

## Step 7: Update CORS Configuration

Update the CORS configuration in `backend/server.js` to include your deployed frontend and admin URLs:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://your-frontend-url.netlify.app",
      "https://your-admin-url.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Type"],
  })
);
```

## Step 8: Redeploy Backend

After updating the CORS configuration, redeploy your backend on Render.

## Monitoring and Maintenance

1. Monitor your Render dashboard for backend logs
2. Monitor your Netlify dashboards for frontend and admin logs
3. Check MongoDB Atlas for database performance

## Troubleshooting

1. **CORS Issues**: Ensure your CORS configuration includes your deployed URLs
2. **API Connection Issues**: Verify your MongoDB connection string and environment variables
3. **Image Loading Issues**: Ensure image URLs are correctly pointing to your deployed backend
4. **Build Failures**: Check that all dependencies are correctly specified in package.json

## Cost Considerations

- MongoDB Atlas (free tier): $0
- Render (free tier): $0 (with some limitations)
- Netlify (free tier): $0 (with some limitations)

Note: Free tiers have limitations on resources and may have downtime. For production applications, consider upgrading to paid plans.
