import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../modals/userModel.js';
import OTP from '../modals/otpModel.js';
import emailService from '../services/emailService.js';
import alternativeEmailService from '../services/alternativeEmailService.js';
import sendGridEmailService from '../services/sendGridEmailService.js';
import smtpFallbackService from '../services/smtpFallbackService.js';

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Log incoming request
    console.log('📧 Received request to send OTP to:', email);

    // Validate email
    if (!email) {
      console.log('❌ Email is required');
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`🔐 Generated OTP for ${email}: ${otp}`);
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);
    console.log(`⏰ OTP for ${email} will expire at:`, expiresAt);

    // Save or update OTP in database
    console.log(`💾 Saving OTP for ${email} to database...`);
    const otpRecord = await OTP.findOneAndUpdate(
      { email },
      { 
        otp,
        expiresAt,
        isUsed: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✅ OTP saved to database:', otpRecord._id);

    // Try SendGrid first (most reliable in hosting environments)
    console.log(`📤 Attempting to send OTP email to ${email} using SendGrid...`);
    let emailResult = await sendGridEmailService.sendOTP(email, otp);
    
    // If SendGrid fails, try primary email service
    if (!emailResult.success) {
      console.log('⚠️ SendGrid failed, trying primary email service...');
      emailResult = await emailService.sendOTP(email, otp);
    }
    
    // If primary service fails, try alternative service
    if (!emailResult.success) {
      console.log('⚠️ Primary email service failed, trying alternative service...');
      emailResult = await alternativeEmailService.sendOTP(email, otp);
    }
    
    // If alternative service fails, try SMTP fallback
    if (!emailResult.success) {
      console.log('⚠️ Alternative email service failed, trying SMTP fallback...');
      emailResult = await smtpFallbackService.sendOTP(email, otp);
    }
    
    if (!emailResult.success) {
      console.log('❌ All email services failed:', emailResult.error);
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailResult.error
      });
    }

    console.log('✅ OTP sent successfully to:', email);
    res.status(200).json({
      message: 'OTP sent successfully to your email',
      emailSent: true
    });
  } catch (error) {
    console.error('💥 Error sending email OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP and authenticate user
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Log incoming request
    console.log('🔑 Received request to verify OTP for:', email);

    // Validate inputs
    if (!email || !otp) {
      console.log('❌ Email and OTP are required');
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Find OTP record
    console.log(`🔍 Looking up OTP record for ${email}...`);
    const otpRecord = await OTP.findOne({ email });

    // Check if OTP exists
    if (!otpRecord) {
      console.log('❌ No OTP found for email:', email);
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      console.log('❌ OTP has expired for email:', email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Check if OTP is already used
    if (otpRecord.isUsed) {
      console.log('❌ OTP has already been used for email:', email);
      return res.status(400).json({ message: 'OTP has already been used. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      console.log(`❌ Invalid OTP for ${email}. Expected: ${otpRecord.otp}, Received: ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Mark OTP as used
    console.log(`✅ Valid OTP for ${email}. Marking as used...`);
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Find or create user
    console.log(`👤 Looking up user with email: ${email}`);
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      console.log(`🆕 Creating new user for email: ${email}`);
      const username = email.split('@')[0]; // Use email prefix as username
      user = new User({
        username,
        email,
        password: await bcrypt.hash('temp_password_' + Date.now(), 10), // Generate a temp password
        role: 'user'
      });
      await user.save();
      console.log('✅ New user created:', user._id);
    } else {
      console.log('✅ Existing user found:', user._id);
    }

    // Generate JWT token
    console.log(`🎫 Generating JWT token for user: ${user._id}`);
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ OTP verification successful for:', email);
    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('💥 Error verifying email OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};