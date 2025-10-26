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

const createAdminUser = async () => {
  try {
    console.log('Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      console.log('ID:', existingAdmin._id);
      process.exit(0);
    }
    
    console.log('Admin user not found, creating new one...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);
    
    // Create admin user
    const adminUser = new User({
      username: 'Admin',
      email: 'admin@foodiefrenzy.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Saving admin user...');
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@foodiefrenzy.com');
    console.log('Password: AdminPassword123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();