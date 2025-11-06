import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modals/userModel.js';

dotenv.config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';

console.log('Connecting to MongoDB:', mongoURI);

mongoose.connect(mongoURI);

const listUsers = async () => {
  try {
    const users = await User.find({}, 'username email role');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();