# Foodie Frenzy Deployment Guide

This guide provides instructions for deploying the Foodie Frenzy application to production environments.

## Deployment Architecture

The application is designed for deployment across multiple platforms:

- **Frontend**: Netlify
- **Admin Panel**: Netlify
- **Backend API**: Render
- **Database**: MongoDB Atlas

## Prerequisites

Before deployment, ensure you have:

1. Accounts on Netlify and Render
2. MongoDB Atlas cluster set up
3. Twilio account for SMS functionality
4. Domain names (optional but recommended)

## Environment Setup

### 1. MongoDB Atlas Configuration

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure database access:
   - Add a database user
   - Add your IP address to the whitelist (or allow access from anywhere for development)
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodiefrenzy
   ```

### 2. Twilio Configuration

1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number (or use the trial number)
4. Note down the phone number for SMS sending

## Backend Deployment (Render)

### 1. Prepare Environment Variables

Create a `.env` file for production:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodiefrenzy
PORT=4000
JWT_SECRET=your_production_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 2. Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following build command:
   ```
   npm install
   ```
4. Set the start command:
   ```
   npm start
   ```
5. Add environment variables from your `.env` file
6. Deploy the service

### 3. Verify Backend Deployment

After deployment, verify the backend is working:

```bash
curl https://your-backend-url.onrender.com/
```

## Frontend Deployment (Netlify)

### 1. Update API Configuration

Update `frontend/src/utils/apiConfig.js`:

```javascript
const apiConfig = {
  baseURL: "https://your-backend-url.onrender.com",
};

export default apiConfig;
```

### 2. Set Environment Variables

In Netlify, set the following environment variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_FRONTEND_URL=https://your-frontend-url.netlify.app
REACT_APP_ADMIN_URL=https://your-admin-url.netlify.app
```

### 3. Deploy to Netlify

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site

### 4. Custom Domain (Optional)

1. Add your custom domain in Netlify
2. Update DNS records as instructed
3. Enable SSL certificate

## Admin Panel Deployment (Netlify)

### 1. Update API Configuration

Update `admin/src/utils/apiConfig.js`:

```javascript
const apiConfig = {
  baseURL: "https://your-backend-url.onrender.com",
};

export default apiConfig;
```

### 2. Set Environment Variables

In Netlify, set the following environment variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_FRONTEND_URL=https://your-frontend-url.netlify.app
REACT_APP_ADMIN_URL=https://your-admin-url.netlify.app
```

### 3. Deploy to Netlify

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site

## Post-Deployment Configuration

### 1. CORS Configuration

Update the backend CORS configuration in `backend/server.js`:

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
  })
);
```

### 2. Test All Services

1. Test frontend functionality:

   - User registration and login
   - Menu browsing
   - Cart functionality
   - Order placement

2. Test admin functionality:

   - Item management
   - Order management
   - User management

3. Test API endpoints:
   - Authentication endpoints
   - Item endpoints
   - Cart endpoints
   - Order endpoints

## Monitoring and Maintenance

### 1. Set Up Monitoring

- Enable Render monitoring for backend
- Set up Netlify analytics for frontend and admin
- Configure MongoDB Atlas monitoring
- Set up error tracking (e.g., Sentry)

### 2. Regular Maintenance Tasks

1. Update dependencies regularly:

   ```bash
   npm outdated
   npm update
   ```

2. Run security audits:

   ```bash
   npm audit
   ```

3. Backup database regularly

### 3. Performance Optimization

1. Enable caching where appropriate
2. Optimize database queries
3. Minimize bundle sizes
4. Use CDNs for static assets

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Solution: Update CORS configuration with correct origins

2. **Authentication Failures**

   - Solution: Verify JWT_SECRET and token handling

3. **Database Connection Issues**

   - Solution: Check MongoDB connection string and network access

4. **SMS Not Sending**
   - Solution: Verify Twilio credentials and phone number

### Logs and Debugging

1. Check Render logs for backend issues
2. Check Netlify logs for frontend/admin issues
3. Check browser console for client-side errors
4. Check MongoDB Atlas for database issues

## Scaling

### Horizontal Scaling

1. Enable auto-scaling on Render
2. Use MongoDB Atlas clusters for database scaling
3. Consider CDN for static assets

### Vertical Scaling

1. Upgrade Render instance types
2. Upgrade MongoDB Atlas cluster tiers
3. Optimize code and database queries

## Rollback Procedures

### If Deployment Fails

1. Revert to previous working version on Render
2. Revert to previous working version on Netlify
3. Restore database from backup if needed

### Database Rollback

1. Identify the point of failure
2. Restore from the most recent backup before the failure
3. Replay any critical transactions if possible

## Security Considerations

1. Use HTTPS for all services
2. Keep dependencies updated
3. Use strong, unique passwords
4. Limit database access permissions
5. Regularly rotate API keys and secrets
6. Implement rate limiting
7. Use environment variables for secrets

## Contact

For deployment issues, contact the development team or check the GitHub repository for issue tracking.
