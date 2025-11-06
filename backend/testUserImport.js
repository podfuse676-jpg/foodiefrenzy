import userModel from "./modals/userModel.js";
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Add connection event listeners for debugging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB (testUserImport.js)');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error (testUserImport.js):', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected (testUserImport.js)');
});

// Connect to MongoDB
console.log('Connecting to database...');
connectDB();

const testUserImport = async () => {
  try {
    console.log('Testing User model import...');
    console.log('User model type:', typeof userModel);
    console.log('User model name:', userModel.modelName);
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to find a user
    console.log('Searching for admin user...');
    const user = await userModel.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      console.log('User details:');
      console.log('- Username:', user.username);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
    }
    
    await mongoose.connection.close();
    console.log('Test completed');
  } catch (error) {
    console.error('User import test error:', error);
  }
};

// Wait for connection to be established
setTimeout(testUserImport, 3000);