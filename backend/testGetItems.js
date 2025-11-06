import mongoose from 'dotenv';
import dotenv from 'dotenv';
import { getItems } from './controllers/itemController.js';

dotenv.config();

// Mock request and response objects
const mockReq = {
  protocol: 'http',
  get: (header) => {
    if (header === 'host') return 'localhost:4000';
    return null;
  }
};

const mockRes = {
  json: (data) => {
    console.log('Response data:', JSON.stringify(data, null, 2));
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  }
};

const mockNext = (err) => {
  if (err) {
    console.error('Error in getItems:', err);
  }
};

const connectDB = async () => {
  try {
    // Import mongoose inside the function to avoid issues
    const mongoose = (await import('mongoose')).default;
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const testGetItems = async () => {
  await connectDB();
  
  try {
    console.log('Testing getItems function...');
    await getItems(mockReq, mockRes, mockNext);
    console.log('getItems function completed successfully.');
  } catch (error) {
    console.error('Error testing getItems function:', error);
  }
  
  // Close the database connection
  const mongoose = (await import('mongoose')).default;
  mongoose.connection.close();
};

testGetItems();