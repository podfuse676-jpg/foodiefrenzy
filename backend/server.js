import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import compression from 'compression';
import rateLimit from 'express-rate-limit'; // Add rate limiting

// Load environment variables
dotenv.config();

// Ensure uploads directory exists (for any local fallback)
const uploadsDir = path.join(process.cwd(), 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  console.log('Creating uploads/images directory...');
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure Cloudinary storage for test endpoint
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'foodiefrenzy_items',
        format: async (req, file) => {
            // Determine format based on file mimetype
            if (file.mimetype.includes('webp')) return 'webp';
            if (file.mimetype.includes('png')) return 'png';
            if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg')) return 'jpg';
            return 'jpg'; // default
        },
        public_id: (req, file) => {
            // Generate unique public ID
            const timestamp = Date.now();
            const originalname = file.originalname.split('.')[0];
            // Sanitize filename for Cloudinary
            const sanitized = originalname.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
            return `${sanitized}_${timestamp}`;
        },
    },
});

// Add file filter to only accept images
const fileFilter = (_req, file, cb) => {
    console.log('File filter checking file:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Import models after database connection
import User from './modals/userModel.js';

// Import routes
import itemRoutes from './routes/itemRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import newOrderRoutes from './routes/newOrderRoutes.js';
import userRoutes from './routes/userRoute.js';
import phoneAuthRoutes from './routes/phoneAuthRoute.js';
import reviewRoutes from './routes/reviewRoute.js';

const app = express();
// Use PORT from environment variable (Render/Railway will set this) or default to 4000
// Railway typically uses PORT, but we'll check common variations
const PORT = process.env.PORT || process.env.$PORT || 4000;

// Log the port for debugging
console.log(`=== SERVER CONFIGURATION ===`);
console.log(`PORT: ${PORT}`);
console.log(`Environment variables:`);
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- $PORT: ${process.env.$PORT}`);
console.log(`===========================`);

// Add compression middleware for better performance
app.use(compression({
  level: 6, // Medium compression level
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress streaming responses
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

// Add security headers
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable DNS prefetching control
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

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
      'https://foodiefrenzy-5hdf.vercel.app', // Add the specific admin deployment URL
      'https://foodiefrenzy-nine.vercel.app',
      'https://admin-7y4pypy16-podfuse676-6967s-projects.vercel.app',
      'https://www.lakeshoreconvenience.com', // Add custom domain
      'https://lakeshoreconvenience.com', // Add custom domain without www
      'https://admin.lakeshoreconvenience.com' // Add custom admin domain
    ];
    
    console.log('=== CORS REQUEST ===');
    console.log('Origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin, allowing request');
      return callback(null, true);
    }
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('Origin is in allowed list, allowing request');
      return callback(null, true);
    }
    
    // Check if it's a Vercel subdomain
    if (origin && origin.endsWith('.vercel.app')) {
      console.log('Origin is a Vercel subdomain, allowing request');
      return callback(null, true);
    }
    
    // Reject the request
    console.log('Origin not allowed, rejecting request');
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Add rate limiting middleware for protection against abuse
// General rate limiter for all requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Specific rate limiter for login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific rate limiter for API endpoints to handle high traffic
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for API endpoints
  message: {
    error: 'API rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(generalLimiter);

// Apply stricter rate limiting to auth endpoints
app.use('/api/auth', loginLimiter);
app.use('/api/users/login', loginLimiter);

// Apply higher rate limiting to API endpoints
app.use('/api/', apiLimiter);

// Add caching headers for static assets
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));

// Connect to database
connectDB();

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory (for local fallback)
// Note: With Cloudinary, images will be served directly from Cloudinary URLs
app.use('/uploads', express.static('uploads'));

// Add a route to serve images with proper headers (for local fallback)
app.get('/uploads/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(process.cwd(), 'uploads', 'images', imageName);
  
  console.log(`Request for image: ${imageName}`);
  console.log(`Looking for file at: ${imagePath}`);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`);
    return res.status(404).json({ message: 'Image not found' });
  }
  
  // Set cache headers for better performance
  res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  
  // Serve the image file
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error serving image:', err);
      res.status(500).json({ message: 'Error serving image' });
    }
  });
});

// Add a route to list all available images (for debugging - local fallback)
app.get('/uploads/images', (req, res) => {
  const imagesDir = path.join(process.cwd(), 'uploads', 'images');
  
  // Check if directory exists
  if (!fs.existsSync(imagesDir)) {
    return res.status(404).json({ message: 'Images directory not found' });
  }
  
  // Read directory contents
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).json({ message: 'Error reading images directory' });
    }
    
    // Filter to only include image files
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || 
      file.endsWith('.png') || file.endsWith('.gif') || 
      file.endsWith('.webp')
    );
    
    res.json({
      message: 'Available images',
      images: imageFiles,
      count: imageFiles.length
    });
  });
});

// Add a simple file upload endpoint for testing
app.post('/api/test-upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path,
    url: req.file.secure_url || req.file.path
  });
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', newOrderRoutes); // Add new order routes
app.use('/api/users', userRoutes);
app.use('/api/auth', phoneAuthRoutes);
app.use('/api/reviews', reviewRoutes);

// Debug endpoint to check environment variables
app.get('/api/debug-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    dbConnectionState: mongoose.connection.readyState,
    dbConnectionHost: mongoose.connection.host,
    dbConnectionName: mongoose.connection.name,
    PORT: process.env.PORT || 'NOT SET',
    // Add Render-specific environment variables
    RENDER: process.env.RENDER || 'NOT SET',
    RENDER_SERVICE_ID: process.env.RENDER_SERVICE_ID || 'NOT SET',
    RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME || 'NOT SET'
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

// Test endpoint to verify Cloudinary configuration
app.get('/api/test-cloudinary', async (req, res) => {
  try {
    console.log('=== TESTING CLOUDINARY CONFIGURATION ===');
    
    // Import the configured Cloudinary instance
    const cloudinary = (await import('./config/cloudinary.js')).default;
    
    // Get current configuration
    const config = cloudinary.config();
    console.log('Current Cloudinary config:', config);
    
    // Test ping Cloudinary
    const pingResult = await cloudinary.api.ping();
    console.log('Cloudinary ping result:', pingResult);
    
    res.json({
      success: true,
      message: 'Cloudinary is properly configured',
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? 'SET' : 'NOT SET'
      },
      ping: pingResult
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary configuration error',
      error: error.message
    });
  }
});

// Test endpoint to verify item ID format
app.get('/api/test-item-id/:id', (req, res) => {
  const { id } = req.params;
  console.log('=== TESTING ITEM ID ===');
  console.log('Item ID:', id);
  console.log('Item ID length:', id ? id.length : 0);
  
  // Validate MongoDB ObjectId format
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const isValid = objectIdRegex.test(id);
  
  console.log('Is valid ObjectId format:', isValid);
  
  res.json({
    id: id,
    length: id ? id.length : 0,
    isValidObjectId: isValid,
    details: isValid 
      ? 'This is a valid MongoDB ObjectId format' 
      : 'This is NOT a valid MongoDB ObjectId format. It should be 24 hexadecimal characters (0-9, a-f, A-F).'
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    port: PORT,
    version: '1.0.0', // Added version for deployment tracking
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint to check environment variables
app.get('/test-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    PORT: process.env.PORT || 'NOT SET'
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

// Health check route for Render/Railway
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
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
      message: 'Admin user lookup failed',
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
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    // Try to find the admin user
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result with explicit database connection:', user ? 'Found' : 'Not found');
    
    if (user) {
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

// Test endpoint to create an admin user
app.post('/test-create-admin', async (req, res) => {
  try {
    console.log('Creating test admin user...');
    
    // Import required modules
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('./modals/userModel.js')).default;
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (existingUser) {
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

// Add robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'https://lakeshoreconvenience.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart
Disallow: /checkout
Disallow: /myorder
Disallow: /login
Disallow: /signup
Disallow: /phone-login

Sitemap: ${baseUrl}/sitemap.xml

User-agent: AdsBot-Google
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: Omgili
Disallow: /
`;

  res.header('Content-Type', 'text/plain');
  res.status(200).send(robotsTxt);
});

// Add sitemap.xml generation endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    // Import the Item model
    const Item = (await import('./modals/item.js')).default;
    
    // Get all items from the database
    const items = await Item.find({}, 'name category _id updatedAt');
    
    // Get the base URL from environment or default
    const baseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'https://lakeshoreconvenience.com';
    
    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/menu</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${items.map(item => `
  <url>
    <loc>${baseUrl}/item/${item._id}</loc>
    <lastmod>${item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
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
  console.error('=== UNCAUGHT EXCEPTION ===');
  console.error('Error:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error('Error:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
});

// Add caching for API responses
app.use('/api/items', (req, res, next) => {
  // Cache items API responses for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Add caching for sitemap
app.use('/sitemap.xml', (req, res, next) => {
  // Cache sitemap for 1 hour
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Add caching for robots.txt
app.use('/robots.txt', (req, res, next) => {
  // Cache robots.txt for 1 day
  res.set('Cache-Control', 'public, max-age=86400');
  next();
});

// Start server - Listen on all interfaces for Render/Railway deployment
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server Started on http://0.0.0.0:${PORT}`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`====================================`);
});

// Add error handling for the server
server.on('error', (error) => {
  console.error('=== SERVER STARTUP ERROR ===');
  console.error('Failed to start server:', error);
  console.error('===========================');
});

server.on('listening', () => {
  console.log('=== SERVER LISTENING EVENT ===');
  console.log('Server is now listening for connections');
  console.log('==============================');
});
