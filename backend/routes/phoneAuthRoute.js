import express from 'express';
import { sendVerificationCode, verifyPhoneCode, loginWithPhone } from '../controllers/phoneAuthController.js';

const router = express.Router();

// Send verification code to phone number
router.post('/send-code', sendVerificationCode);

// Verify the code sent to phone number
router.post('/verify-code', verifyPhoneCode);

// Login with phone number
router.post('/login', loginWithPhone);

export default router;