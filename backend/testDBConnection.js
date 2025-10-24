import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const testDbConnection = async () => {
  try {
    console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
    
    // Connect to MongoDB
    await connectDB();
    
    console.log('DB CONNECTED');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to find items
    const items = await mongoose.connection.db.collection('items').find({}).toArray();
    console.log('Items in items collection:', items.length);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('DB CONNECTION ERROR:', err.message || err);
  }
};

testDbConnection();