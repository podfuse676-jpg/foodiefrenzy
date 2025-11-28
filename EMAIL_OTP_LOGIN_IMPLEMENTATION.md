# Email OTP Login System Implementation

This document summarizes the complete implementation of the Email OTP Login system for the Foodie Frenzy web application.

## Backend Implementation

### 1. OTP Model (`backend/modals/otpModel.js`)

- Created a MongoDB model to store OTP records
- Fields: email, otp, expiresAt, isUsed
- Automatic cleanup of expired OTPs using MongoDB TTL index

### 2. Email Service (`backend/services/emailService.js`)

- Created a service using Nodemailer to send OTP emails via Gmail SMTP
- HTML email template with Lakeshore Convenience branding
- Proper error handling and logging

### 3. Email Authentication Controller (`backend/controllers/emailAuthController.js`)

- `sendEmailOTP`: Generates and sends 6-digit OTP to email
- `verifyEmailOTP`: Verifies OTP and authenticates user
- Automatic user creation for new email addresses
- JWT token generation for authenticated users
- Comprehensive validation and error handling

### 4. Email Authentication Routes (`backend/routes/emailAuthRoute.js`)

- POST `/api/email-auth/send-email-otp` - Send OTP to email
- POST `/api/email-auth/verify-email-otp` - Verify OTP and authenticate

### 5. Server Integration (`backend/server.js`)

- Registered new email authentication routes
- Integrated with existing CORS and security configurations

### 6. Environment Variables (`.env.example`)

Added new environment variables:

- `EMAIL_USER` - Gmail address for sending OTPs
- `EMAIL_PASS` - App password for Gmail authentication
- `OTP_EXPIRY_MINUTES` - OTP expiration time (default: 5 minutes)

## Frontend Implementation

### 1. Email Login Page (`frontend/src/pages/EmailLogin/EmailLogin.jsx`)

- Two-step authentication flow:
  1. Enter email address to receive OTP
  2. Enter received OTP to authenticate
- Responsive design with Lakeshore Convenience branding
- Form validation and error handling
- Resend OTP functionality
- Redirect to home page on successful authentication

### 2. Navigation Integration

- Updated Navbar to redirect to email login page
- Maintained existing phone login option as alternative

## Key Features

### Security

- 6-digit numeric OTPs
- 5-minute expiration by default
- One-time use verification
- Automatic cleanup of expired OTPs
- JWT token authentication
- Input validation and sanitization

### User Experience

- Clean, responsive UI with consistent branding
- Clear feedback for all actions
- Error handling with user-friendly messages
- Loading states during API requests
- Option to resend OTP
- Seamless redirect after successful login

### Technical Implementation

- Modular code organization
- Proper separation of concerns
- Reusable components and services
- Environment-based configuration
- Comprehensive error handling
- MongoDB TTL for automatic cleanup

## API Endpoints

### Send OTP

```
POST /api/email-auth/send-email-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response:

```json
{
  "message": "OTP sent successfully to your email",
  "emailSent": true
}
```

### Verify OTP

```
POST /api/email-auth/verify-email-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:

```json
{
  "message": "OTP verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Environment Setup

### Backend (.env)

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OTP_EXPIRY_MINUTES=5
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env.local)

```
VITE_API_URL=https://your-backend-url.com
```

## Dependencies

### Backend

- Added `nodemailer` for email sending capabilities

## Testing

All backend components have been tested and verified:

- OTP Model: OK
- Email Service: OK
- Email Auth Controller: OK

## Deployment

The system is ready for deployment to:

- Backend: Railway
- Frontend: Vercel

No additional configuration is required beyond setting the environment variables.
