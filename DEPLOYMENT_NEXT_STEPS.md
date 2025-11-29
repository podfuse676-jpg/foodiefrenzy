# Deployment Next Steps

## 1. Set Up Resend API Key

You need to obtain a Resend API key and configure it in your Render environment variables:

1. Sign up for Resend at https://resend.com/
2. Go to the API Keys section and create a new API key
3. Copy the API key

## 2. Verify Your Domain in Resend

The error message indicates that your domain `lakeshoreconvenience.com` needs to be verified:

1. In your Resend dashboard, go to the Domains section
2. Add your domain `lakeshoreconvenience.com`
3. Follow the DNS verification steps (usually involves adding TXT or CNAME records to your DNS provider)
4. Wait for verification to complete

## 3. Configure Render Environment Variables

In your Render dashboard:

1. Go to your backend service
2. Navigate to Environment Variables
3. Add or update these variables:
   - `RESEND_API_KEY` = [Your Resend API key]
   - `FROM_EMAIL` = noreply@lakeshoreconvenience.com

## 4. Redeploy Backend

After setting the environment variables:

1. Trigger a new deployment in Render
2. Wait for the deployment to complete
3. Check the logs for any errors

## 5. Test Email Functionality

Once deployed, test the email functionality:

1. Visit your frontend at https://lakeshoreconvenience.com
2. Try the email login feature
3. Check if you receive the OTP email

## 6. Alternative Solution (Temporary)

If you continue to have issues with domain verification, you can temporarily use a Gmail address as the sender:

1. Change the `FROM_EMAIL` environment variable to `lakeshoreconvenience@gmail.com`
2. Redeploy the backend
3. Note that this may have deliverability issues compared to a verified domain

## 7. Verify Deployments

Check that all services are properly deployed:

- Frontend: https://lakeshoreconvenience.com
- Admin Panel: https://admin.lakeshoreconvenience.com
- Backend API: https://lakeshore-convenience.onrender.com

## 8. Test All Features

After deployment, test these key features:

- Email OTP login
- Menu browsing
- Cart functionality
- Order placement
- Admin panel access
