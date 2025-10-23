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

const listCollections = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    console.log('Listing collections...');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('Collections found:');
    collections.forEach(collection => {
      console.log('- Name:', collection.name);
      console.log('  Type:', collection.type);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing collections:', error);
    process.exit(1);
  }
};

listCollections();