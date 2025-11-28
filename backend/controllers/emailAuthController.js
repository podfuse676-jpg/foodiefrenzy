import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../modals/userModel.js';
import OTP from '../modals/otpModel.js';
import emailService from '../services/emailService.js';

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);

    // Save or update OTP in database
    await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt,
        isUsed: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP via email
    const emailResult = await emailService.sendOTP(email, otp);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailResult.error
      });
    }

    res.status(200).json({
      message: 'OTP sent successfully to your email',
      emailSent: true
    });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP and authenticate user
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });

    // Check if OTP exists
    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Check if OTP is already used
    if (otpRecord.isUsed) {
      return res.status(400).json({ message: 'OTP has already been used. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      const username = email.split('@')[0]; // Use email prefix as username
      user = new User({
        username,
        email,
        password: await bcrypt.hash('temp_password_' + Date.now(), 10), // Generate a temp password
        role: 'user'
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};