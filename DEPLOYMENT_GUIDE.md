# Foodie Frenzy - Deployment Guide

This guide will help you deploy the full-stack Foodie Frenzy application (frontend, admin panel, and backend) to free hosting platforms.

## Architecture Overview

- **Frontend**: React + Vite application (customer-facing)
- **Admin Panel**: React + Vite application (admin dashboard)
- **Backend**: Node.js + Express API with MongoDB
- **Database**: MongoDB Atlas (cloud-hosted)

## Deployment Plan

1. **Database**: MongoDB Atlas (free tier)
2. **Backend API**: Render.com (free tier)
3. **Frontend**: Netlify (free tier)
4. **Admin Panel**: Netlify (free tier)

## Prerequisites

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

### Update Environment Variables

Create a `.env` file in the backend directory with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_VERIFIED_NUMBER=your_verified_phone_number
NODE_ENV=production
```

### Update package.json

Update the backend `package.json` scripts section:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Step 3: Deploy Backend to Render

1. Push your backend code to a GitHub repository
2. Sign up at [Render](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: foodiefrenzy-backend
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in the Render dashboard
7. Deploy the service

Note the deployed URL (e.g., https://foodiefrenzy-backend.onrender.com)

## Step 4: Update API URLs in Frontend and Admin

Before deploying the frontend and admin panel, you need to update the API URLs:

### Frontend Updates

1. In `frontend/src/CartContext/CartContext.jsx`, replace all instances of `http://localhost:4000` with your Render backend URL
2. In `frontend/src/components/CartPage/CartPage.jsx`, update the `API_URL` constant
3. In `frontend/src/components/Checkout/Checkout.jsx`, replace all instances of `http://localhost:4000` with your Render backend URL
4. In `frontend/src/components/Login/Login.jsx`, update the `url` constant
5. In `frontend/src/components/MyOredrsPage/MyOrdersPage.jsx`, replace all instances of `http://localhost:4000` with your Render backend URL
6. In `frontend/src/components/OurMenu/OurMenu.jsx`, replace `http://localhost:4000` with your Render backend URL

### Admin Panel Updates

1. In `admin/src/components/AddItems/AddItems.jsx`, replace `http://localhost:4000` with your Render backend URL
2. In `admin/src/components/ListItems/ListItems.jsx`, replace all instances of `http://localhost:4000` with your Render backend URL
3. In `admin/src/components/Orders/Orders.jsx`, replace all instances of `http://localhost:4000` with your Render backend URL

## Step 5: Update CORS Configuration

Update the CORS configuration in `backend/server.js` to include your deployed frontend and admin URLs:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
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

## Step 6: Deploy Frontend to Netlify

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Sign up at [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure the deployment:
   - Branch: main (or your default branch)
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy the site

## Step 7: Deploy Admin Panel to Netlify

1. Build the admin panel:
   ```bash
   cd admin
   npm run build
   ```
2. In Netlify, create another new site
3. Connect the same GitHub repository
4. Configure the deployment:
   - Branch: main (or your default branch)
   - Base directory: `admin`
   - Build command: `npm run build`
   - Publish directory: `admin/dist`
5. Deploy the site

## Step 8: Environment Variables for Frontend and Admin

For both frontend and admin panels, you may need to set environment variables in Netlify if you have any.

## Step 9: Update Database with Image URLs

After deploying, you may need to update your database to use the correct image URLs:

1. Update the `imageUrl` fields in your database items to point to your deployed backend URL
2. Or update the frontend to construct image URLs using the deployed backend URL

## Monitoring and Maintenance

1. Monitor your Render dashboard for backend logs
2. Monitor your Netlify dashboards for frontend and admin logs
3. Check MongoDB Atlas for database performance
4. Set up alerts for your services

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

## Next Steps

1. Set up custom domains for your frontend and admin panel
2. Configure SSL certificates (usually automatic with Netlify)
3. Set up monitoring and alerting
4. Optimize performance with caching
5. Set up automated backups for your database
