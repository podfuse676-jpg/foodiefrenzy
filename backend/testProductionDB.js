import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testProductionDB = async () => {
  try {
    console.log('Testing production database connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    });
    console.log('Database connected successfully');
    
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
    console.log('Searching for admin user...');
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
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
    console.error('Production DB test error:', error);
  }
};

testProductionDB();