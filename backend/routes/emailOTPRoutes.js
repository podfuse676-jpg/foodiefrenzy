import express from 'express';
import { sendEmailOTP, verifyEmailOTP } from '../controllers/emailOTPController.js';

const emailOTPRoutes = express.Router();

// Send OTP to email
emailOTPRoutes.post('/send-email-otp', sendEmailOTP);

// Verify OTP and authenticate user
emailOTPRoutes.post('/verify-email-otp', verifyEmailOTP);

export default emailOTPRoutes;