import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect directly to MongoDB
const mongoURI = process.env.MONGODB_URI;

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

const checkUser = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    console.log('Checking for admin user...');
    
    // Check if admin user exists
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    if (user) {
      console.log('User found:');
      console.log('- Email:', user.email);
      console.log('- Username:', user.username);
      console.log('- Role:', user.role);
      console.log('- ID:', user._id);
    } else {
      console.log('User not found');
    }
    
    // Count all users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
};

checkUser();