import userModel from "./modals/userModel.js";
import mongoose from 'mongoose';
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

const testUserModel = async () => {
  try {
    console.log('Testing User model import...');
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if userModel is properly imported
    console.log('User model:', typeof userModel);
    console.log('User model name:', userModel.modelName);
    
    // Try to find a user
    const users = await userModel.find({}, 'username email role');
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log('- ' + user.username + ' (' + user.email + ') - Role: ' + user.role);
    });
    
    // Specifically look for admin user
    console.log('\nLooking for admin user...');
    const adminUser = await userModel.findOne({ email: 'admin@foodiefrenzy.com' });
    if (adminUser) {
      console.log('Admin user found:', adminUser.username, adminUser.email, adminUser.role);
    } else {
      console.log('Admin user not found');
      
      // Try case insensitive search
      const adminUserCI = await userModel.findOne({ 
        email: { $regex: new RegExp('admin@foodiefrenzy.com', 'i') } 
      });
      if (adminUserCI) {
        console.log('Admin user found with case insensitive search:', adminUserCI.username, adminUserCI.email, adminUserCI.role);
      } else {
        console.log('Admin user not found with case insensitive search either');
      }
    }
    
    await mongoose.connection.close();
    console.log('Test completed');
  } catch (error) {
    console.error('User model test error:', error);
  }
};

// Wait for connection to be established
setTimeout(testUserModel, 2000);