import userModel from "./modals/userModel.js";
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

// Connect to MongoDB
connectDB();

const testUserModel = async () => {
  try {
    console.log('Testing User model import...');
    
    // Check if userModel is properly imported
    console.log('User model:', typeof userModel);
    console.log('User model name:', userModel.modelName);
    
    // Try to find a user
    const users = await userModel.find({}, 'username email role');
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log('- ' + user.username + ' (' + user.email + ') - Role: ' + user.role);
    });
    
    await mongoose.connection.close();
    console.log('Test completed');
  } catch (error) {
    console.error('User model test error:', error);
  }
};

testUserModel();