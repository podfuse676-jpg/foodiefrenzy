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

const queryUsers = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    console.log('Querying users collection...');
    
    // Query the users collection directly
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log('- Email:', user.email);
      console.log('  Username:', user.username);
      console.log('  Role:', user.role);
      console.log('  ID:', user._id);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error querying users:', error);
    process.exit(1);
  }
};

queryUsers();