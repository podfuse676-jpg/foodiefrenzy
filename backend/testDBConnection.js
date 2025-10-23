import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testDBConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    console.log('Connecting to MongoDB:', uri);
    
    await mongoose.connect(uri);
    console.log('Database connected successfully');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log('- ' + collection.name);
    });
    
    // Try to access users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log('- ' + user.username + ' (' + user.email + ') - Role: ' + user.role);
    });
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

testDBConnection();