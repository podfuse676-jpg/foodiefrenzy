import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    try {
        await mongoose.connect(uri, {
            // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
        });
        
        // Explicitly switch to the foodiefrenzy database
        const db = mongoose.connection.useDb('foodiefrenzy');
        
        console.log('DB CONNECTED');
        console.log('Connected to database:', db.name);
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        console.error('This may be due to IP whitelist restrictions in MongoDB Atlas.');
        console.error('Please ensure your MongoDB Atlas cluster allows connections from Render.');
        console.error('You can whitelist 0.0.0.0/0 for testing purposes.');
        // Don't exit the process - allow the application to continue running
        // This will cause API calls that need the database to fail, but the server will stay up
    }
};

// Helpful notes (kept from original): how to get a MongoDB Atlas connection string
// 1. Sign up / Log in to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
// 2. Create a project and deploy a cluster (Shared tier is free)
// 3. Create a database user with a password
// 4. Whitelist your IP under Network Access (or use 0.0.0.0/0 for dev)
// 5. Connect -> Connect your application -> copy the connection string
// 6. Add it to backend/.env as: MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.../dbname?retryWrites=true&w=majority"

//
// 1. SIGN UP / LOG IN TO MONGODB ATLAS
//    • Visit: https://www.mongodb.com/cloud/atlas
//    • Create a free account or log in.
//
// 2. CREATE OR SELECT A PROJECT
//    • In the Atlas dashboard, click "Projects".
//    • Click "New Project" to create one, or select an existing project.
//
// 3. DEPLOY A CLUSTER (IF NEEDED)
//    • Inside your project, click "Build a Cluster".
//    • Choose the Shared (free) tier.
//    • Pick your cloud provider & region, then "Create Cluster".
//    • Wait for provisioning to complete (a few minutes).
//
// 4. ADD A DATABASE USER (THIS IS YOUR USERNAME & PASSWORD)
//    • In the left menu, choose "Database Access".
//    • Click "+ ADD NEW DATABASE USER".
//    • Under "Authentication Method," select "Password."
//    • Enter your desired Username (e.g. myAppUser).
//    • Enter & confirm a secure Password (make note of it).
//    • Under "Database User Privileges," grant at least "Read and write to any database."
//    • Click "Add User."
//
// 5. WHITELIST YOUR IP ADDRESS
//    • In the left menu, go to "Network Access."
//    • Click "+ ADD IP ADDRESS."
//    • Click "Add Current IP Address" or enter 0.0.0.0/0 (less secure).
//    • Click "Confirm."
//
// 6. COPY YOUR CONNECTION STRING
//    • In the left menu, click "Clusters".
//    • On your cluster, click the blue "Connect" button.
//    • Choose "Connect your application".
//    • Copy the URI, e.g.:
//      mongodb+srv://<username>:<password>@cluster0.t5l2pir.mongodb.net/Taskflow?retryWrites=true&w=majority
//    • Replace <username> and <password> with the ones you created.
//
// 7. STORE CREDENTIALS IN ENVIRONMENT VARIABLES
//    • In Render, set the environment variable:
//        MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.t5l2pir.mongodb.net/foodiefrenzy?retryWrites=true&w=majority
//
// You can now safely paste these commented steps into your code file! 😊