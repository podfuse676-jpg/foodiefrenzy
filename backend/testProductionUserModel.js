import userModel from "./modals/userModel.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testProductionUserModel = async () => {
  try {
    console.log('Testing User model import in production environment...');
    console.log('User model type:', typeof userModel);
    console.log('User model name:', userModel.modelName);
    
    // Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    });
    console.log('Database connected successfully');
    
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
    console.error('Production User model test error:', error);
  }
};

testProductionUserModel();