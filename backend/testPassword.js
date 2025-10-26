import bcrypt from 'bcryptjs';
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
    console.log('Searching for user with email: admin@foodiefrenzy.com');
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (!user) {
      console.log('User not found with exact match');
      
      // Try case insensitive search
      const users = await User.find({});
      console.log('All users in database:');
      users.forEach(u => {
        console.log(`- ${u.username} (${u.email})`);
      });
      
      // Try case insensitive search
      const userCI = await User.findOne({ 
        email: { $regex: new RegExp('admin@foodiefrenzy.com', 'i') } 
      });
      if (userCI) {
        console.log('Found user with case insensitive search:', userCI.username, userCI.email);
      } else {
        console.log('No user found with case insensitive search either');
      }
      
      process.exit(1);
    }
    
    console.log('User found:', user.username, user.email);
    console.log('Stored password hash:', user.password);
    console.log('User role:', user.role);
    
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