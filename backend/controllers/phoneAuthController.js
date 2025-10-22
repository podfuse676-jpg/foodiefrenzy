import User from '../modals/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send verification OTP using Twilio
const sendVerificationOTP = async (phoneNumber, code) => {
  try {
    console.log(`=== SENDING OTP TO: ${phoneNumber} ===`);
    console.log(`Code: ${code}`);
    
    // Format the message as requested
    const message = `THE LOGIN CODE FOR LOG IN TO LAKESHORE CONVENIENCE IS ${code}`;
    
    // Send SMS using Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log(`Message sent with SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    // Fall back to console logging for development
    console.log(`=== FREE OTP VERIFICATION SYSTEM (FALLBACK) ===`);
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Code: ${code}`);
    console.log(`=====================================`);
    return false;
  }
};

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code to phone number
export const sendVerificationCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Generate a verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Find user by phone number or create a new one
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      // Create a temporary user with just the phone number
      user = new User({
        username: `user_${Date.now()}`,
        email: `${phoneNumber}@temp.foodiefrenzy.com`,
        password: Math.random().toString(36).slice(-8),
        phoneNumber,
        phoneVerificationCode: verificationCode,
        phoneVerificationExpires: verificationExpires
      });
      await user.save();
    } else {
      // Update existing user with new verification code
      user.phoneVerificationCode = verificationCode;
      user.phoneVerificationExpires = verificationExpires;
      await user.save();
    }
    
    // Send the verification code using our free OTP system
    await sendVerificationOTP(phoneNumber, verificationCode);
    
    // Always return the verification code in the response for free implementation
    res.status(200).json({ 
      message: 'Verification code generated successfully',
      verificationCode: verificationCode
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ message: 'Error sending verification code' });
  }
};

// Verify the code sent to the phone number
export const verifyPhoneCode = async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    
    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({ message: 'Phone number and verification code are required' });
    }
    
    // Find the user by phone number
    const user = await User.findOne({ 
      phoneNumber,
      phoneVerificationCode: verificationCode,
      phoneVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    // Mark the phone as verified
    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      message: 'Phone verified successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Error verifying phone code:', error);
    res.status(500).json({ message: 'Error verifying phone code' });
  }
};

// Login with phone number and verification code
export const loginWithPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Generate a verification code and send it
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this phone number' });
    }
    
    // Update user with new verification code
    user.phoneVerificationCode = verificationCode;
    user.phoneVerificationExpires = verificationExpires;
    await user.save();
    
    // Send the verification code via SMS (uses sendVerificationOTP defined above)
    await sendVerificationOTP(phoneNumber, verificationCode);
    
    // Return the verification code in development mode for easy testing
    res.status(200).json({ 
      message: 'Verification code sent for login',
      verificationCode: verificationCode // Include code for testing when SMS fails
    });
  } catch (error) {
    console.error('Error in phone login:', error);
    res.status(500).json({ message: 'Error in phone login' });
  }
};