import userModel from "./modals/userModel.js";
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testProductionLogin = async () => {
  try {
    console.log('Testing login function in production environment...');
    
    // Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    });
    console.log('Database connected successfully');
    
    // Test login function
    const email = 'admin@foodiefrenzy.com';
    const password = 'AdminPassword123!';
    
    console.log('Login attempt for email:', email);
    
    // CHECK IF USER IS AVAILABLE WITH THIS ID
    const user = await userModel.findOne({ email });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('User not found in database for email:', email);
      await mongoose.connection.close();
      return;
    }

    console.log('User found:', user.username, user.email, user.role);
    
    // MATCHING USER AND PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      await mongoose.connection.close();
      return;
    }
    
    console.log('Login test successful');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Production login test error:', error);
  }
};

testProductionLogin();