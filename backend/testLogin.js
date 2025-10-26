import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';

console.log('Connecting to MongoDB:', mongoURI);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connect(mongoURI);

const testLogin = async () => {
  try {
    console.log('Testing login for admin@foodiefrenzy.com');
    
    // Define user schema
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phoneNumber: { type: String, unique: true, sparse: true },
      isPhoneVerified: { type: Boolean, default: false },
      phoneVerificationCode: { type: String },
      phoneVerificationExpires: { type: Date },
      role: { type: String, enum: ['user', 'admin'], default: 'user' }
    });
    
    // Create or get user model
    const User = mongoose.models.user || mongoose.model('user', userSchema);
    
    // Try to find the user
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('User not found in database');
      process.exit(1);
    }
    
    console.log('User found:', user.username, user.email, user.role);
    
    // Test password comparison
    const isMatch = await bcrypt.compare('AdminPassword123!', user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      process.exit(1);
    }
    
    console.log('Login test successful');
    process.exit(0);
  } catch (error) {
    console.error('Login test error:', error);
    process.exit(1);
  }
};

// Wait for connection to be established
setTimeout(testLogin, 2000);