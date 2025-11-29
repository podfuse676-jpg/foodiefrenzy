import express from 'express';
import { sendWhatsAppOTP, verifyWhatsAppOTP } from '../controllers/whatsappAuthController.js';

const whatsappAuthRoutes = express.Router();

// Send OTP to WhatsApp
whatsappAuthRoutes.post('/send-wa-otp', sendWhatsAppOTP);

// Verify OTP and authenticate user
whatsappAuthRoutes.post('/verify-wa-otp', verifyWhatsAppOTP);

export default whatsappAuthRoutes;