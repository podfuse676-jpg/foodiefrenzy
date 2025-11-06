# Foodie Frenzy Maintenance Guide

This guide provides instructions for maintaining and updating the Foodie Frenzy application.

## Project Overview

Foodie Frenzy is a full-stack food ordering application with three main components:

1. **Frontend** - Customer-facing application
2. **Admin** - Administrative panel for managing items and orders
3. **Backend** - API server handling business logic and data storage

## Recent Improvements

The following improvements have been made to enhance the application:

### 1. Console Error Fixes

- Resolved React Router future flag warnings
- Fixed 403 Forbidden errors for cart API
- Improved local cart functionality with better error handling

### 2. Frontend Alignment Fixes

- Improved rotating dishes (orbiting images) alignment
- Enhanced responsive design for different screen sizes
- Better image scaling across devices

### 3. Login Implementation Fixes

- Corrected API endpoints for authentication
- Improved authentication state management
- Enhanced user experience for both email and phone login
- Added proper loading states and error handling

### 4. Admin Panel Fixes

- Resolved "React is not defined" errors
- Fixed JSX syntax issues in components

## Maintenance Tasks

### 1. Regular Updates

#### Update Dependencies

```bash
# Update frontend dependencies
cd frontend
npm outdated
npm update

# Update admin dependencies
cd ../admin
npm outdated
npm update

# Update backend dependencies
cd ../backend
npm outdated
npm update
```

#### Security Audits

```bash
# Check for security vulnerabilities
cd frontend
npm audit

cd ../admin
npm audit

cd ../backend
npm audit
```

### 2. Database Maintenance

#### Check MongoDB Connection

Ensure the MongoDB instance is running and accessible:

```bash
# For local MongoDB
brew services list | grep mongodb

# Or check connection with mongo shell
mongosh mongodb://localhost:27017/foodiefrenzy
```

#### Backup Database

```bash
# Create a backup of the database
mongodump --uri="mongodb://localhost:27017/foodiefrenzy" --out=/path/to/backup
```

### 3. Code Quality

#### Run Linting

```bash
# Frontend linting
cd frontend
npm run lint

# Admin linting
cd ../admin
npm run lint
```

#### Format Code

```bash
# Format code with Prettier (if configured)
cd frontend
npx prettier --write src/

cd ../admin
npx prettier --write src/
```

### 4. Testing

#### Run Tests (if available)

```bash
# Frontend tests
cd frontend
npm test

# Admin tests
cd ../admin
npm test

# Backend tests
cd ../backend
npm test
```

## Common Issues and Solutions

### 1. Authentication Issues

- **Problem**: Users unable to login
- **Solution**:
  - Check JWT_SECRET in backend .env
  - Verify Twilio credentials for phone authentication
  - Ensure proper token storage and retrieval

### 2. API Connection Issues

- **Problem**: Frontend cannot connect to backend
- **Solution**:
  - Check API URLs in frontend/src/utils/apiConfig.js
  - Verify backend is running on correct port
  - Check CORS configuration in backend

### 3. Cart Functionality Issues

- **Problem**: Cart not working properly
- **Solution**:
  - Check localStorage permissions
  - Verify authentication tokens
  - Ensure proper error handling in CartContext

### 4. Responsive Design Issues

- **Problem**: Layout issues on different screen sizes
- **Solution**:
  - Check Tailwind CSS classes
  - Verify responsive breakpoints
  - Test on various device sizes

## Deployment Checklist

### Before Deployment

- [ ] Update version numbers in package.json files
- [ ] Run security audits
- [ ] Test all functionality
- [ ] Update environment variables
- [ ] Create database backup
- [ ] Check logs for errors

### After Deployment

- [ ] Verify all services are running
- [ ] Test key user flows
- [ ] Monitor application performance
- [ ] Check error logs
- [ ] Update documentation

## Monitoring

### Logs

Check logs for each service:

```bash
# Backend logs
cd backend
tail -f backend.log

# Frontend logs (in browser console)
# Admin logs (in browser console)
```

### Performance

Monitor:

- API response times
- Database query performance
- Frontend loading times
- Error rates

## Backup and Recovery

### Code Backup

```bash
# Push to remote repository
git add .
git commit -m "Backup commit"
git push origin main
```

### Database Backup

```bash
# Create database backup
mongodump --uri="mongodb://localhost:27017/foodiefrenzy" --out=backups/$(date +%Y%m%d)
```

### Recovery Process

1. Restore database from backup
2. Deploy latest code
3. Update environment variables
4. Test all functionality

## Documentation Updates

Keep documentation up to date:

- Update README.md when adding new features
- Maintain API documentation
- Update deployment guides
- Document any breaking changes

## Contact

For maintenance issues, contact the development team or check the GitHub repository for issue tracking.
