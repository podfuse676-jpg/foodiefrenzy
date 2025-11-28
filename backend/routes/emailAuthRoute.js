import express from 'express';
import { sendEmailOTP, verifyEmailOTP } from '../controllers/emailAuthController.js';

const emailAuthRoutes = express.Router();

// Send OTP to email
emailAuthRoutes.post('/send-email-otp', sendEmailOTP);

// Verify OTP and authenticate user
emailAuthRoutes.post('/verify-email-otp', verifyEmailOTP);

export default emailAuthRoutes;