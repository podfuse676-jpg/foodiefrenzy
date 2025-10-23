import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testDbConnection = async () => {
  try {
    console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
    });
    
    console.log('DB CONNECTED');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to find the admin user
    const collectionsNames = collections.map(c => c.name);
    if (collectionsNames.includes('users')) {
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      console.log('Users in users collection:', users.length);
      users.forEach(user => {
        console.log('- Email:', user.email, 'Username:', user.username, 'Role:', user.role);
      });
    } else {
      console.log('No users collection found');
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('DB CONNECTION ERROR:', err.message || err);
  }
};

testDbConnection();