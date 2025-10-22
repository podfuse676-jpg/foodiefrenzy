# Foodie Frenzy Deployment Checklist

This checklist will guide you through the complete deployment process for the Foodie Frenzy application.

## Pre-Deployment Checklist

### 1. Database Setup (MongoDB Atlas)

- [ ] Create MongoDB Atlas account
- [ ] Create a new project
- [ ] Deploy a free cluster (M0 Sandbox)
- [ ] Create database user with read/write permissions
- [ ] Configure network access (allow 0.0.0.0/0 for development)
- [ ] Copy connection string

### 2. Code Preparation

- [ ] Update backend package.json with production start script
- [ ] Create .env files for all services
- [ ] Verify all API calls use environment variables (not hardcoded localhost)
- [ ] Update CORS configuration with deployed URLs
- [ ] Test locally with production environment variables

### 3. Version Control

- [ ] Initialize Git repository (if not already done)
- [ ] Commit all changes
- [ ] Push code to GitHub repository

## Deployment Steps

### 4. Backend Deployment (Render.com)

- [ ] Sign up for Render.com account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: foodiefrenzy-backend
  - Root Directory: backend
  - Runtime: Node
  - Build Command: npm install
  - Start Command: npm start
- [ ] Add environment variables:
  - MONGO_URI (from MongoDB Atlas)
  - JWT_SECRET
  - STRIPE_SECRET_KEY
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_PHONE_NUMBER
  - TWILIO_VERIFIED_NUMBER
- [ ] Deploy service
- [ ] Note deployed URL (e.g., https://foodiefrenzy-backend.onrender.com)

### 5. Frontend Deployment (Netlify)

- [ ] Sign up for Netlify account
- [ ] Create new site from Git
- [ ] Connect GitHub repository
- [ ] Configure:
  - Base directory: frontend
  - Build command: npm run build
  - Publish directory: dist
- [ ] Add environment variables:
  - REACT_APP_API_URL (Render backend URL)
  - REACT_APP_FRONTEND_URL (Netlify frontend URL)
  - REACT_APP_ADMIN_URL (Netlify admin URL)
- [ ] Deploy site
- [ ] Note deployed URL (e.g., https://foodiefrenzy-frontend.netlify.app)

### 6. Admin Panel Deployment (Netlify)

- [ ] Create new site from same Git repository
- [ ] Configure:
  - Base directory: admin
  - Build command: npm run build
  - Publish directory: dist
- [ ] Add environment variables:
  - REACT_APP_API_URL (Render backend URL)
  - REACT_APP_FRONTEND_URL (Netlify frontend URL)
  - REACT_APP_ADMIN_URL (Netlify admin URL)
- [ ] Deploy site
- [ ] Note deployed URL (e.g., https://foodiefrenzy-admin.netlify.app)

### 7. Final Configuration

- [ ] Update backend CORS configuration with deployed frontend and admin URLs
- [ ] Redeploy backend on Render
- [ ] Test all services:
  - [ ] Backend API endpoints
  - [ ] Frontend application
  - [ ] Admin panel
  - [ ] Database connections
  - [ ] Image uploads and serving
  - [ ] User authentication
  - [ ] Cart functionality
  - [ ] Order processing

## Post-Deployment Checklist

### 8. Testing

- [ ] Test user registration and login
- [ ] Test menu item display
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test admin panel item management
- [ ] Test admin panel order management
- [ ] Test image uploads in admin panel
- [ ] Test all forms and submissions

### 9. Monitoring Setup

- [ ] Set up monitoring for backend (Render dashboard)
- [ ] Set up monitoring for frontend (Netlify dashboard)
- [ ] Set up monitoring for admin panel (Netlify dashboard)
- [ ] Set up MongoDB Atlas monitoring
- [ ] Configure error tracking
- [ ] Set up uptime monitoring

### 10. Security Review

- [ ] Verify environment variables are not exposed
- [ ] Check CORS configuration
- [ ] Verify database security settings
- [ ] Review authentication implementation
- [ ] Check for any hardcoded secrets

### 11. Performance Optimization

- [ ] Enable Netlify asset optimization
- [ ] Configure caching strategies
- [ ] Optimize database queries
- [ ] Set up CDN if needed

## Maintenance Tasks

### 12. Ongoing Maintenance

- [ ] Regular database backups
- [ ] Monitor usage limits on free tiers
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Review logs for errors

## Troubleshooting

### Common Issues

- [ ] CORS errors: Check CORS configuration
- [ ] Database connection errors: Verify MONGO_URI
- [ ] API errors: Check Render logs
- [ ] Build failures: Check dependencies in package.json
- [ ] Environment variable issues: Verify all required variables are set

### Support Resources

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Render: https://render.com
- Netlify: https://netlify.com
- Foodie Frenzy Documentation: See DEPLOYMENT_GUIDE.md

## Success Criteria

When all of the following are working correctly, your deployment is complete:

- [ ] Users can register and log in through the frontend
- [ ] Users can browse menu items
- [ ] Users can add items to cart and place orders
- [ ] Admin can log in to admin panel
- [ ] Admin can manage menu items
- [ ] Admin can view and manage orders
- [ ] Images are properly uploaded and displayed
- [ ] All forms submit correctly
- [ ] No console errors in browser
- [ ] No errors in deployment platform logs

## Next Steps

After successful deployment:

1. Set up custom domains for frontend and admin panel
2. Configure SSL certificates (usually automatic with Netlify)
3. Set up automated backups for your database
4. Configure monitoring and alerting
5. Test disaster recovery procedures
6. Document the deployment for your team
