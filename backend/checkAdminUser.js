import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
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

// Define user schema exactly as in the userModel.js
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

// Create user model exactly as in the userModel.js
const User = mongoose.models.user || mongoose.model("user", userSchema);

const checkAdminUser = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    console.log('Checking for admin user...');
    
    // Use the exact same query as in the login function
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    console.log('Admin user lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      console.log('Admin user found:');
      console.log('- Email:', user.email);
      console.log('  Username:', user.username);
      console.log('  Role:', user.role);
      console.log('  ID:', user._id);
    } else {
      console.log('Admin user not found in the user collection');
      
      // Let's also check all collections to see if the user exists elsewhere
      console.log('Checking all collections for admin user...');
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      for (const collection of collections) {
        try {
          const docs = await mongoose.connection.db.collection(collection.name).find({ email: 'admin@foodiefrenzy.com' }).toArray();
          if (docs.length > 0) {
            console.log('Found admin user in collection:', collection.name);
            console.log('Documents:', docs);
          }
        } catch (err) {
          console.log('Error checking collection', collection.name, ':', err.message);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
};

checkAdminUser();