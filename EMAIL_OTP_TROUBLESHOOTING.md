# Email OTP Troubleshooting Guide

## Common Issues and Solutions

### 1. OTP Not Being Sent

#### Problem:

Users report that they're not receiving OTP emails after entering their email address.

#### Possible Causes and Solutions:

##### A. Environment Variables Not Set

**Symptoms:**

- No emails sent at all
- Error messages about missing configuration

**Solution:**

1. Check that these environment variables are set in your Render dashboard:

   - `EMAIL_USER` = lakeshoreconvenience@gmail.com
   - `EMAIL_PASS` = [Your Gmail app password]
   - `OTP_EXPIRY_MINUTES` = 5
   - `JWT_SECRET` = [Your JWT secret]

2. Verify values are correct:
   - `EMAIL_USER` should be your Gmail address
   - `EMAIL_PASS` should be an App Password, NOT your regular Gmail password

##### B. Incorrect Gmail App Password

**Symptoms:**

- Authentication errors in logs
- Messages about "Invalid credentials" or "Bad credentials"

**Solution:**

1. Generate a new App Password:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password (without spaces) as your `EMAIL_PASS`

##### C. Gmail Security Settings

**Symptoms:**

- Connection timeouts
- SSL/TLS errors

**Solution:**

1. Ensure "Less secure app access" is disabled (it should be disabled for security)
2. Make sure 2-Factor Authentication is enabled
3. Use App Passwords instead of your regular password

##### D. Network/Firewall Issues (CONNECTION TIMEOUT)

**Symptoms:**

- Timeouts when sending emails
- "ETIMEDOUT" errors in logs
- "Connection timeout" error messages

**Solution:**
This is the most common issue on Render. Many hosting providers block outbound SMTP connections for security reasons.

**Immediate Solutions:**

1. **Try Alternative Email Services:**

   - Sign up for SendGrid (Free tier: 100 emails/day)
   - Use Mailgun (Free tier: 5,000 emails/month)
   - Try AWS SES (Free tier available)

2. **Contact Render Support:**

   - Ask if they block outbound SMTP connections on free tier
   - Request SMTP access for your service

3. **Use Alternative Ports/Configuration:**
   - We've implemented alternative SMTP configurations that may work better

### 2. Testing the Email Service

#### Run the Test Scripts

You can test if the email service is working correctly:

1. SSH into your Render instance or run locally:
   ```bash
   cd backend
   npm run test-email-service
   npm run test-alternative-email-service
   ```

#### Manual API Test

You can also test the API endpoint directly:

```bash
curl -X POST https://lakeshore-convenience.onrender.com/api/email-auth/send-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

### 3. Checking Render Logs

#### View Detailed Logs

1. Go to your Render dashboard
2. Select your backend service
3. Click on "Logs"
4. Look for entries with:
   - 📧 (email sending attempts)
   - ❌ (errors)
   - ✅ (success messages)

#### Common Log Patterns to Look For:

- "Email service not configured"
- "Authentication failed"
- "OTP sent successfully"
- "Failed to send OTP email"
- "Connection timeout" (ETIMEDOUT)

### 4. Verifying Gmail Configuration

#### Steps to Ensure Gmail Works:

1. **Enable 2-Factor Authentication:**

   - Go to Google Account settings
   - Click "Security"
   - Enable "2-Step Verification"

2. **Generate App Password:**

   - In Security section, click "App passwords"
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Use App Password (Not Regular Password):**
   - In Render environment variables, set `EMAIL_PASS` to the app password
   - Remove any spaces from the app password

### 5. Debugging Checklist

Before reporting issues, check:

- [ ] Environment variables are set correctly in Render
- [ ] `EMAIL_USER` is a valid Gmail address
- [ ] `EMAIL_PASS` is a Gmail App Password (not regular password)
- [ ] 2-Factor Authentication is enabled on the Gmail account
- [ ] App Password was generated correctly
- [ ] Recent logs don't show authentication errors
- [ ] Test email script runs successfully locally
- [ ] Both primary and alternative email services were tested

### 6. Common Error Messages and Fixes

| Error Message                        | Likely Cause                  | Solution                                        |
| ------------------------------------ | ----------------------------- | ----------------------------------------------- |
| "Invalid login" or "Bad credentials" | Wrong password                | Use App Password instead of regular password    |
| "Service not found"                  | Network issue                 | Check Render logs, contact support              |
| "Connection timeout" (ETIMEDOUT)     | Firewall/Network restrictions | Use alternative email service or contact Render |
| "Email service not configured"       | Missing env vars              | Set EMAIL_USER and EMAIL_PASS in Render         |

### 7. Alternative Email Services

If Gmail continues to have connection issues, consider these alternatives:

#### SendGrid (Recommended)

1. Sign up at https://sendgrid.com/
2. Get free API key
3. Update your email service to use SendGrid SMTP:
   - Host: smtp.sendgrid.net
   - Port: 587
   - Username:apikey
   - Password: YOUR_SENDGRID_API_KEY

#### Mailgun

1. Sign up at https://www.mailgun.com/
2. Get sandbox domain credentials
3. Use SMTP settings provided

### 8. Additional Debugging Steps

#### Enable Detailed Logging

Add this to your Render environment variables:

```
DEBUG=nodemailer:*
```

#### Test Locally

1. Create a `.env` file in the backend directory:

   ```
   EMAIL_USER=lakeshoreconvenience@gmail.com
   EMAIL_PASS=your_app_password
   JWT_SECRET=your_jwt_secret
   ```

2. Run the test scripts:
   ```bash
   cd backend
   npm run test-email-service
   npm run test-alternative-email-service
   ```

If this works locally but not on Render, the issue is likely with Render's network restrictions.

### 9. Need More Help?

If you're still having issues:

1. Share recent Render logs showing the timeout error
2. Verify your environment variables are set correctly
3. Try the test scripts locally to isolate the issue
4. Check that you're using an App Password, not your regular Gmail password
5. Consider switching to SendGrid or another email service provider
