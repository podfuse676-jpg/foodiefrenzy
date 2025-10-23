import { getItems } from './controllers/itemController.js';
import Item from './modals/item.js';
import mongoose from 'mongoose';

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
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));
  },
  status: (code) => {
    console.log(`Status: ${code}`);
    return mockRes;
  }
};

const mockNext = (err) => {
  console.error('Error:', err);
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Call the getItems function
    await getItems(mockReq, mockRes, mockNext);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });