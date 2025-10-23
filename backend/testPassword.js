import bcrypt from 'bcrypt';
import User from './modals/userModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
console.log('Connecting to MongoDB:', mongoURI);
mongoose.connect(mongoURI);

const testPassword = async () => {
  try {
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    console.log('User found:', user.username, user.email);
    console.log('Stored password hash:', user.password);
    
    // Test password comparison
    const isMatch = await bcrypt.compare('AdminPassword123!', user.password);
    console.log('Password match:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing password:', error);
    process.exit(1);
  }
};

testPassword();