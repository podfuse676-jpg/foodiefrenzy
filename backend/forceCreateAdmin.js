import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

const forceCreateAdmin = async () => {
  try {
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
    
    console.log('Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      console.log('ID:', existingAdmin._id);
      
      // Update the role to make sure it's admin
      if (existingAdmin.role !== 'admin') {
        console.log('Updating admin user role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Admin user role updated');
      }
      
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

// Wait for connection to be established
setTimeout(forceCreateAdmin, 2000);