import mongoose from 'mongoose';
import Item from './modals/item.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Drop the old unique index on 'name' field
      console.log('Dropping old unique index on name field...');
      await Item.collection.dropIndex('name_1');
      console.log('✅ Old index dropped successfully');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('⚠️  Index already dropped or does not exist');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }
    
    try {
      // Create the new compound unique index
      console.log('\nCreating new compound unique index on (name, category)...');
      await Item.collection.createIndex(
        { name: 1, category: 1 },
        { unique: true }
      );
      console.log('✅ New compound index created successfully');
    } catch (error) {
      if (error.code === 85 || error.message.includes('already exists')) {
        console.log('⚠️  Compound index already exists');
      } else {
        console.error('Error creating index:', error.message);
      }
    }
    
    // List all indexes
    console.log('\nCurrent indexes on Item collection:');
    const indexes = await Item.collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)} ${idx.unique ? '(unique)' : ''}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
