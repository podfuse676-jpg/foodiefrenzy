import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './modals/userModel.js';

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

const checkAdminPassword = async () => {
  try {
    console.log('Checking admin user password...');
    
    // Check if admin user already exists
    const adminUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found:');
    console.log('Email:', adminUser.email);
    console.log('Username:', adminUser.username);
    console.log('Role:', adminUser.role);
    console.log('Password hash:', adminUser.password);
    
    // Test password
    const testPassword = 'AdminPassword123!';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    console.log('Password match result:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin password:', error);
    process.exit(1);
  }
};

setTimeout(checkAdminPassword, 2000);