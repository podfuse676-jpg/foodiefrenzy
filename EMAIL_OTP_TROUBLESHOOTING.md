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

   - `RESEND_API_KEY` = [Your Resend API key]
   - `FROM_EMAIL` = noreply@lakeshoreconvenience.com
   - `OTP_EXPIRY_MINUTES` = 5
   - `JWT_SECRET` = [Your JWT secret]

2. Verify values are correct:
   - `RESEND_API_KEY` should be your Resend API key
   - `FROM_EMAIL` should be a verified sender domain/email

##### B. Incorrect Resend API Key

**Symptoms:**

- Authentication errors in logs
- Messages about "Invalid API key" or "Unauthorized"

**Solution:**

1. Generate a new Resend API key:
   - Go to your Resend dashboard
   - Navigate to API Keys section
   - Generate a new API key with appropriate permissions
   - Use this API key as your `RESEND_API_KEY`

##### C. Domain Verification Issues

**Symptoms:**

- Emails being rejected
- DNS verification errors

**Solution:**

1. Ensure your domain is verified in Resend:
   - Go to your Resend dashboard
   - Navigate to Domains section
   - Add and verify your domain (noreply@lakeshoreconvenience.com)
   - Follow DNS verification steps

##### D. Network/Firewall Issues (CONNECTION TIMEOUT)

**Symptoms:**

- Timeouts when sending emails
- "ETIMEDOUT" errors in logs
- "Connection timeout" error messages

**Solution:**
This is less common with Resend as it uses HTTP APIs rather than SMTP connections.

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

### 4. Verifying Resend Configuration

#### Steps to Ensure Resend Works:

1. **Sign up for Resend:**

   - Go to https://resend.com/
   - Click "Sign up"
   - Complete registration

2. **Get Your API Key:**

   - Go to API Keys section
   - Click "Create API Key"
   - Give it a name (e.g., "FoodieFrenzy")
   - Copy the generated API key

3. **Configure Render Environment Variables:**

   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment"
   - Add these variables:
     - `RESEND_API_KEY` = [Your Resend API key]
     - `FROM_EMAIL` = noreply@lakeshoreconvenience.com (or your verified sender)

4. **Verify Your Domain:**
   - In Resend, go to Domains section
   - Add your domain
   - Follow DNS verification steps
   - Confirm the verification

### 5. Setting Up Resend (RECOMMENDED SOLUTION)

Resend is more reliable on hosting platforms like Render and doesn't have SMTP connection issues.

#### Steps to Set Up Resend:

1. **Sign up for Resend:**

   - Go to https://resend.com/
   - Click "Sign up"
   - Complete registration

2. **Get Your API Key:**

   - Go to API Keys section
   - Click "Create API Key"
   - Give it a name (e.g., "FoodieFrenzy")
   - Copy the generated API key

3. **Configure Render Environment Variables:**

   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment"
   - Add these variables:
     - `RESEND_API_KEY` = [Your Resend API key]
     - `FROM_EMAIL` = noreply@lakeshoreconvenience.com (or your verified sender)

4. **Verify Your Domain:**
   - In Resend, go to Domains section
   - Add your domain
   - Follow DNS verification steps
   - Confirm the verification

### 6. Debugging Checklist

Before reporting issues, check:

- [ ] Environment variables are set correctly in Render
- [ ] `RESEND_API_KEY` is a valid Resend API key
- [ ] `FROM_EMAIL` is a verified sender domain/email
- [ ] Recent logs don't show authentication errors
- [ ] Test email script runs successfully locally
- [ ] Both primary and alternative email services were tested
- [ ] Domain is verified in Resend

### 7. Common Error Messages and Fixes

| Error Message                        | Likely Cause                  | Solution                                     |
| ------------------------------------ | ----------------------------- | -------------------------------------------- |
| "Invalid login" or "Bad credentials" | Wrong password                | Use App Password instead of regular password |
| "Service not found"                  | Network issue                 | Check Render logs, contact support           |
| "Connection timeout" (ETIMEDOUT)     | Firewall/Network restrictions | Use Resend or contact Render                 |
| "Email service not configured"       | Missing env vars              | Set RESEND_API_KEY in Render                 |

### 8. Alternative Email Services

If you continue to have connection issues, Resend is already implemented and is the recommended solution.

#### Resend (Already Implemented)

Resend is already integrated into your application. You just need to:

1. Sign up at https://resend.com/
2. Get your API key
3. Set the `RESEND_API_KEY` environment variable in Render

#### Other Alternatives

If Resend doesn't work for your use case:

##### Mailgun

1. Sign up at https://www.mailgun.com/
2. Get sandbox domain credentials
3. Use SMTP settings provided

### 9. Additional Debugging Steps

#### Enable Detailed Logging

Add this to your Render environment variables:

```
DEBUG=resend:*
```

#### Test Locally

1. Create a `.env` file in the backend directory:

   ```
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@lakeshoreconvenience.com
   JWT_SECRET=your_jwt_secret
   ```

2. Run the test scripts:
   ```bash
   cd backend
   npm run test-email-service
   npm run test-alternative-email-service
   ```

If this works locally but not on Render, the issue is likely with Render's network restrictions.

### 10. Need More Help?

If you're still having issues:

1. Share recent Render logs showing the timeout error
2. Verify your environment variables are set correctly
3. Try the test scripts locally to isolate the issue
4. Check that you're using a valid Resend API key
5. Consider verifying your domain in Resend dashboard
