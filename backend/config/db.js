import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    try {
        await mongoose.connect(uri, {
            // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
        });
        console.log('DB CONNECTED');
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        console.error('This may be due to IP whitelist restrictions in MongoDB Atlas.');
        console.error('Please ensure your MongoDB Atlas cluster allows connections from Render.');
        console.error('You can whitelist 0.0.0.0/0 for testing purposes.');
        // Don't exit the process - allow the application to continue running
        // This will cause API calls that need the database to fail, but the server will stay up
    }
};
