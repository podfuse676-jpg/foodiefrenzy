# Render Deployment Fix for Email OTP System

## Issue

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'nodemailer' imported from /opt/render/project/src/backend/services/emailService.js
```

## Root Cause

Render is not properly installing the `nodemailer` dependency during the build process, even though it's listed in package.json. This appears to be related to how Render handles the project structure and dependency installation.

## Solution Applied

1. **Updated render.yaml** to use `rootDir: backend` instead of build commands that change directories
2. **Added a test script** to verify nodemailer can be imported
3. **Committed and pushed** these changes to GitHub

## Additional Fixes

1. Added EMAIL_USER and EMAIL_PASS environment variables to render.yaml for better configuration management
2. Added a test script to verify nodemailer installation

## Next Steps

### Step 1: Redeploy Backend to Render

1. Go to your Render dashboard: https://dashboard.render.com/
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete (usually 5-10 minutes)

### Step 2: Verify Environment Variables

In your Render dashboard, ensure these environment variables are set:

- `EMAIL_USER` = lakeshoreconvenience@gmail.com
- `EMAIL_PASS` = [Your Gmail app password]
- `OTP_EXPIRY_MINUTES` = 5
- `JWT_SECRET` = [Your JWT secret]
- `MONGODB_URI` = [Your MongoDB connection string]

### Step 3: Test the Fix

After deployment completes:

1. Check Render logs for successful deployment
2. Visit your backend health endpoint: https://lakeshore-convenience.onrender.com/health
3. Test the email OTP flow on your frontend

## Alternative Solutions (If the Above Doesn't Work)

### Option 1: Force Reinstall Dependencies

Sometimes Render caches dependencies incorrectly. Try:

1. Add this to your render.yaml buildCommand:
   ```yaml
   buildCommand: rm -rf node_modules package-lock.json && npm install
   ```

### Option 2: Use Render's Built-in Environment Variable Sync

Instead of adding EMAIL_USER and EMAIL_PASS to render.yaml, you can:

1. Remove the lines from render.yaml
2. Set them directly in Render's environment variables section
3. Make sure "sync: false" is set so they're not overwritten

### Option 3: Check Node Version Compatibility

The error might be related to Node.js version compatibility:

1. In render.yaml, try changing NODE_VERSION to 18.x or 20.x
2. Redeploy and test

### Option 4: Explicitly Install nodemailer in Build Process

If the above doesn't work, try explicitly installing nodemailer:

1. Update render.yaml buildCommand:
   ```yaml
   buildCommand: npm install && npm install nodemailer@latest
   ```

## Verification Commands

You can verify the fix worked by checking:

```bash
# Check if nodemailer is installed
npm list nodemailer

# Test import in Node.js
node -e "import('nodemailer').then(() => console.log('nodemailer: OK')).catch(err => console.error('nodemailer Error:', err));"
```

## Expected Outcome

After successful deployment:

- The `/api/email-auth/send-email-otp` endpoint should be accessible
- Email OTP functionality should work correctly
- No more ERR_MODULE_NOT_FOUND errors in Render logs

## Debugging Tips

If you continue to have issues:

1. Check Render logs for any error messages during the build process
2. Verify that the backend directory is correctly recognized
3. Ensure package.json in the backend directory lists nodemailer as a dependency
4. Try clearing Render's build cache by changing a minor detail in render.yaml
