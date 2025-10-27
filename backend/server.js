import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Import database connection
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

// Add connection event listeners for debugging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB (server.js)');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error (server.js):', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected (server.js)');
});

// Connect to MongoDB
console.log('Connecting to database...');
connectDB();

// Import models after database connection
import User from './modals/userModel.js';

// Import routes
import itemRoutes from './routes/itemRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import userRoutes from './routes/userRoute.js';
import phoneAuthRoutes from './routes/phoneAuthRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS with a dynamic origin function to allow all Vercel subdomains
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
      'https://foodiefrenzy-frontend.vercel.app',
      'https://foodiefrenzy-admin.vercel.app',
      'https://foodiefrenzy-5hdf.vercel.app',
      'https://foodiefrenzy-nine.vercel.app',
      'https://admin-7y4pypy16-podfuse676-6967s-projects.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if it's a Vercel subdomain
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject the request
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', phoneAuthRoutes);

// Debug endpoint to check environment variables
app.get('/api/debug-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    dbConnectionState: mongoose.connection.readyState,
    dbConnectionHost: mongoose.connection.host,
    dbConnectionName: mongoose.connection.name
  });
});

// Test endpoint to verify database connection and user lookup
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const users = await User.find({}, 'username email role');
    console.log('Users found:', users.length);
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: users.length,
      users: users.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test endpoint to explicitly look for the admin user
app.get('/api/test-admin', async (req, res) => {
  try {
    console.log('Testing admin user lookup...');
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found',
        user: {
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
  } catch (error) {
    console.error('Admin user test error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin user lookup failed',
      error: error.message
    });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', port: PORT });
});

// Simple test endpoint to check environment variables
app.get('/test-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET'
  });
});

// Test endpoint to simulate login function
app.get('/test-login', async (req, res) => {
  try {
    console.log('Test login endpoint called');
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    console.log('User model imported');
    
    // Perform the exact same query as in the login function
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Database connection host:', mongoose.connection.host);
    console.log('Database connection name:', mongoose.connection.name);
    
    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exist" });
    }
    
    res.json({ 
      success: true, 
      message: "User found",
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ success: false, message: "Error", error: error.message });
  }
});

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', port: PORT, timestamp: new Date().toISOString() });
});

// Simple test endpoint to check if we can find the admin user
app.get('/test-admin-user', async (req, res) => {
  try {
    console.log('Testing admin user lookup...');
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    // Try to find the admin user
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
  } catch (error) {
    console.error('Test admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin user',
      error: error.message
    });
  }
});

// Test endpoint to explicitly use the user model to find the admin user
app.get('/test-admin-user-explicit', async (req, res) => {
  try {
    console.log('Testing admin user lookup with explicit model...');
    
    // Import the user model
    const userModel = (await import('./modals/userModel.js')).default;
    
    // Use the user model to find the admin user
    const user = await userModel.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result with explicit model:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found with explicit model',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found with explicit model'
      });
    }
  } catch (error) {
    console.error('Test admin user error with explicit model:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin user with explicit model',
      error: error.message
    });
  }
});

// Test endpoint to explicitly connect to the database and find the admin user
app.get('/test-admin-user-db', async (req, res) => {
  try {
    console.log('Testing admin user lookup with explicit database connection...');
    
    // Import mongoose
    const mongoose = (await import('mongoose')).default;
    
    // Get the database connection
    const db = mongoose.connection;
    
    // Check if we're connected
    if (db.readyState !== 1) {
      console.log('Database not connected');
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }
    
    // List all collections
    const collections = await db.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check if the users collection exists
    const usersCollectionExists = collections.some(c => c.name === 'users');
    console.log('Users collection exists:', usersCollectionExists);
    
    if (!usersCollectionExists) {
      console.log('Users collection does not exist');
      return res.json({
        success: false,
        message: 'Users collection does not exist'
      });
    }
    
    // Try to find the admin user
    const users = await db.db.collection('users').find({ email: 'admin@foodiefrenzy.com' }).toArray();
    console.log('Users found:', users.length);
    
    if (users.length > 0) {
      const user = users[0];
      res.json({
        success: true,
        message: 'Admin user found with explicit database connection',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found with explicit database connection'
      });
    }
  } catch (error) {
    console.error('Test admin user error with explicit database connection:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin user with explicit database connection',
      error: error.message
    });
  }
});

// Endpoint to check MongoDB URI and connection details
app.get('/check-mongo-config', (req, res) => {
  const mongoUri = process.env.MONGODB_URI || 'Not set';
  const sanitizedUri = mongoUri.replace(/:[^:@]+@/, ':****@'); // Hide password
  
  res.json({
    MONGODB_URI: sanitizedUri,
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    dbConnectionState: mongoose.connection.readyState,
    dbConnectionHost: mongoose.connection.host,
    dbConnectionName: mongoose.connection.name,
    dbConnectionString: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Endpoint to create an admin user (for testing purposes)
app.post('/create-admin', async (req, res) => {
  try {
    console.log('Creating admin user...');
    
    // Import required modules
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('./modals/userModel.js')).default;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return res.json({
        success: false,
        message: 'Admin user already exists'
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create the admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@foodiefrenzy.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    // Save the user
    const savedUser = await adminUser.save();
    console.log('Admin user created successfully:', savedUser.email);
    
    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        email: savedUser.email,
        username: savedUser.username,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Test endpoint to directly authenticate admin user (for testing purposes)
app.post('/test-admin-login', async (req, res) => {
  try {
    console.log('Test admin login endpoint called');
    
    // Import required modules
    const User = (await import('./modals/userModel.js')).default;
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      return res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    // Create token
    const { createToken } = await import('./controllers/userController.js');
    const token = createToken(adminUser);
    
    console.log('Test admin login successful');
    
    res.json({
      success: true,
      token: token,
      role: adminUser.role
    });
  } catch (error) {
    console.error('Test admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Test admin login error',
      error: error.message
    });
  }
});

// Endpoint to reset admin password (for testing purposes)
app.post('/reset-admin-password', async (req, res) => {
  try {
    console.log('Resetting admin password...');
    
    // Import required modules
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('./modals/userModel.js')).default;
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      return res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Update the password
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('Admin password reset successfully');
    
    res.json({
      success: true,
      message: 'Admin password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting admin password',
      error: error.message
    });
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Global error handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Started on http://0.0.0.0:${PORT}`);
});
