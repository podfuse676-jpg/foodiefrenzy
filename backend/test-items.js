import mongoose from 'mongoose';
import Item from './modals/item.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Try to get items directly
    const items = await Item.find().sort({ createdAt: -1 });
    console.log('Items from database:');
    console.log(JSON.stringify(items, null, 2));
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });