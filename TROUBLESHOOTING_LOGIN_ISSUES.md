# Troubleshooting Login Issues

This guide will help you identify and fix login issues with your Foodie Frenzy application deployed on Vercel and Render.

## Common Issues and Solutions

### 1. Services Not Deployed

**Problem**: You're trying to access the application, but it's not deployed yet.

**Solution**: Deploy all services to their respective platforms:

1. **Frontend on Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set Framework Preset to "Vite"
   - Set Root Directory to "frontend"
   - Add Environment Variable: `REACT_APP_API_URL=https://lakeshoreconveniencee-backend.onrender.com`
   - Click "Deploy"

2. **Admin Panel on Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set Framework Preset to "Vite"
   - Set Root Directory to "admin"
   - Add Environment Variable: `REACT_APP_API_URL=https://lakeshoreconveniencee-backend.onrender.com`
   - Click "Deploy"

3. **Backend on Render** (if not already deployed):
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the following:
     - Name: `foodiefrenzy-backend`
     - Region: Choose the closest region
     - Branch: `main`
     - Root Directory: `backend`
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     JWT_SECRET=your_jwt_secret_here_(at_least_32_characters)
     STRIPE_SECRET_KEY=your_stripe_secret_key_here
     FRONTEND_URL=https://foodiefrenzy-frontend.vercel.app
     ADMIN_URL=https://foodiefrenzy-5hdf.vercel.app
     NODE_ENV=production
     TWILIO_ACCOUNT_SID= (leave empty if not using SMS)
     TWILIO_AUTH_TOKEN= (leave empty if not using SMS)
     TWILIO_PHONE_NUMBER= (leave empty if not using SMS)
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=4000
     CORS_ORIGIN=https://foodiefrenzy-frontend.vercel.app
     ```
   - Click "Create Web Service"

### 2. CORS Issues

**Problem**: The frontend can't communicate with the backend due to CORS restrictions.

**Solution**:

1. Check that your backend CORS configuration includes your frontend URLs:

   ```javascript
   app.use(
     cors({
       origin: [
         "http://localhost:5173",
         "http://localhost:5174",
         process.env.FRONTEND_URL || "http://localhost:5173",
         process.env.ADMIN_URL || "http://localhost:5174",
         "https://foodiefrenzy-frontend.vercel.app",
         "https://foodiefrenzy-admin.vercel.app",
         "https://foodiefrenzy-5hdf.vercel.app",
       ],
       credentials: true,
     })
   );
   ```

2. Verify that your Render environment variables include:
   - `FRONTEND_URL=https://foodiefrenzy-frontend.vercel.app`
   - `ADMIN_URL=https://foodiefrenzy-5hdf.vercel.app`

### 3. Environment Variables Not Set

**Problem**: The frontend doesn't know where to send API requests.

**Solution**:

1. Check that your frontend `.env` file contains:

   ```
   REACT_APP_API_URL=https://lakeshoreconveniencee-backend.onrender.com
   ```

2. Check that your admin panel `.env` file contains:

   ```
   REACT_APP_API_URL=https://lakeshoreconveniencee-backend.onrender.com
   ```

3. In Vercel, make sure these environment variables are set in the project settings:
   - Go to your Vercel project
   - Click "Settings" → "Environment Variables"
   - Add `REACT_APP_API_URL` with the value `https://lakeshoreconveniencee-backend.onrender.com`

### 4. Hardcoded URLs Still Present

**Problem**: Components still use hardcoded localhost URLs instead of the API configuration.

**Solution**:

1. Verify that all components use the API configuration:

   ```javascript
   import apiConfig from "../../utils/apiConfig";
   const url = apiConfig.baseURL;
   // Use `${url}/api/endpoint` instead of hardcoded URLs
   ```

2. Run this command to check for any remaining hardcoded URLs:
   ```bash
   grep -r "http://localhost:4000" frontend/src/components/
   grep -r "http://localhost:4000" admin/src/components/
   ```

### 5. MongoDB Connection Issues

**Problem**: The backend can't connect to the database.

**Solution**:

1. Check that your MongoDB URI is correct in the Render environment variables.

2. Make sure your MongoDB Atlas cluster allows connections from Render IPs:

   - In Render, go to your service → Settings → IP Address
   - Copy the IP address
   - In MongoDB Atlas, go to Network Access → Add IP Address
   - Add the Render IP address

3. For testing purposes, you can temporarily whitelist `0.0.0.0/0` in MongoDB Atlas.

### 6. Authentication Issues

**Problem**: Login fails even with correct credentials.

**Solution**:

1. Check browser console for errors:

   - Open Developer Tools (F12)
   - Go to the Console tab
   - Try to log in and check for any error messages

2. Check network requests:

   - Open Developer Tools (F12)
   - Go to the Network tab
   - Try to log in and check the request to `/api/users/login`
   - Check the request URL, headers, and response

3. Verify that you're using the correct credentials:
   - Make sure you've registered an account first
   - Check that the email and password are correct

## Debugging Steps

### Step 1: Check Service Status

1. Verify that your backend is running:

   ```bash
   curl -I https://lakeshoreconveniencee-backend.onrender.com/health
   ```

   You should get a 200 response.

2. Check if your frontend is deployed:
   ```bash
   curl -I https://foodiefrenzy-frontend.vercel.app
   ```
   You should get a 200 response (not 404).

### Step 2: Check API Communication

1. Test the login endpoint directly:
   ```bash
   curl -X POST https://lakeshoreconveniencee-backend.onrender.com/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```
   You should get a response indicating the user doesn't exist (which means the API is working).

### Step 3: Check Browser Console

1. Open your deployed frontend in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Try to log in
5. Check for any error messages

### Step 4: Check Network Requests

1. Open your deployed frontend in a browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Try to log in
5. Find the request to `/api/users/login`
6. Check:
   - Request URL (should be your Render backend URL)
   - Request headers
   - Request payload
   - Response status and body

## Additional Help

If you're still experiencing issues after following these steps:

1. Check the deployment logs on Vercel and Render for any error messages
2. Verify that all environment variables are correctly set
3. Make sure your GitHub repository is up to date with all the changes
4. Try redeploying all services after making any changes

If you continue to have issues, please provide:

1. Screenshots of any error messages in the browser console
2. Screenshots of the network request details for the login request
3. Deployment logs from Vercel and Render
