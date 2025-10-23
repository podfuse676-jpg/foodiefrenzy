import { connectDB } from './config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Add connection event listeners for debugging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB (testServerDB.js)');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error (testServerDB.js):', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected (testServerDB.js)');
});

// Connect to MongoDB
console.log('Connecting to database...');
connectDB();

const testServerDB = async () => {
  try {
    console.log('Testing database connection in server context...');
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    
    process.exit(0);
  } catch (error) {
    console.error('Server DB test error:', error);
    process.exit(1);
  }
};

// Wait for connection to be established
setTimeout(testServerDB, 3000);