import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../modals/userModel.js';
import WhatsAppOTP from '../modals/whatsappOTPModel.js';
import whatsappService from '../services/whatsappService.js';

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to WhatsApp
export const sendWhatsAppOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Log incoming request
    console.log('📱 Received request to send WhatsApp OTP to:', phoneNumber);

    // Validate phone number
    if (!phoneNumber) {
      console.log('❌ Phone number is required');
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Basic phone number validation (at least 10 digits after removing non-digits)
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length < 10) {
      console.log('❌ Invalid phone number format:', phoneNumber);
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`🔐 Generated OTP for ${phoneNumber}: ${otp}`);
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);
    console.log(`⏰ OTP for ${phoneNumber} will expire at:`, expiresAt);

    // Save or update OTP in database
    console.log(`💾 Saving OTP for ${phoneNumber} to database...`);
    const otpRecord = await WhatsAppOTP.findOneAndUpdate(
      { phoneNumber },
      { 
        otp,
        expiry: expiresAt,
        used: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✅ OTP saved to database:', otpRecord._id);

    // Send OTP via WhatsApp
    console.log(`📤 Attempting to send OTP via WhatsApp to ${phoneNumber}...`);
    const whatsappResult = await whatsappService.sendOTP(phoneNumber, otp);
    
    if (!whatsappResult.success) {
      console.log('❌ Failed to send WhatsApp OTP:', whatsappResult.error);
      return res.status(500).json({ 
        message: 'Failed to send OTP via WhatsApp',
        error: whatsappResult.error
      });
    }

    console.log('✅ OTP sent successfully to:', phoneNumber);
    res.status(200).json({
      message: 'OTP sent successfully to your WhatsApp',
      whatsappSent: true
    });
  } catch (error) {
    console.error('💥 Error sending WhatsApp OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP and authenticate user
export const verifyWhatsAppOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Log incoming request
    console.log('🔑 Received request to verify WhatsApp OTP for:', phoneNumber);

    // Validate inputs
    if (!phoneNumber || !otp) {
      console.log('❌ Phone number and OTP are required');
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Basic phone number validation
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length < 10) {
      console.log('❌ Invalid phone number format:', phoneNumber);
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    // Find OTP record
    console.log(`🔍 Looking up OTP record for ${phoneNumber}...`);
    const otpRecord = await WhatsAppOTP.findOne({ phoneNumber });

    // Check if OTP exists
    if (!otpRecord) {
      console.log('❌ No OTP found for phone number:', phoneNumber);
      return res.status(400).json({ message: 'No OTP found for this phone number. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (otpRecord.expiry < new Date()) {
      console.log('❌ OTP has expired for phone number:', phoneNumber);
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Check if OTP is already used
    if (otpRecord.used) {
      console.log('❌ OTP has already been used for phone number:', phoneNumber);
      return res.status(400).json({ message: 'OTP has already been used. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      console.log(`❌ Invalid OTP for ${phoneNumber}. Expected: ${otpRecord.otp}, Received: ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Mark OTP as used
    console.log(`✅ Valid OTP for ${phoneNumber}. Marking as used...`);
    otpRecord.used = true;
    await otpRecord.save();

    // Find or create user
    console.log(`👤 Looking up user with phone number: ${phoneNumber}`);
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // Create new user if not exists
      console.log(`🆕 Creating new user for phone number: ${phoneNumber}`);
      // Generate a username based on phone number
      const username = `user_${phoneNumber.replace(/\D/g, '')}`;
      user = new User({
        username,
        phoneNumber,
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
      { id: user._id, phoneNumber: user.phoneNumber, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ OTP verification successful for:', phoneNumber);
    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('💥 Error verifying WhatsApp OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};