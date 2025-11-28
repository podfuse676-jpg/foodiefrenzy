// Test to check if routes work without database connection
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/itemRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import newOrderRoutes from './routes/newOrderRoutes.js';
import userRoutes from './routes/userRoute.js';
import phoneAuthRoutes from './routes/phoneAuthRoute.js';
import reviewRoutes from './routes/reviewRoute.js';
import testRoutes from './routes/testRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3003;

// Add middleware to parse JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));

// Add a simple middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Mock the database connection status
let databaseConnected = false;
let serverReady = true;

// Add a middleware to check if server is ready
app.use((req, res, next) => {
  if (!serverReady) {
    return res.status(503).json({ 
      status: 'Service Unavailable', 
      message: 'Server is still initializing' 
    });
  }
  next();
});

// Log route registration
console.log('=== REGISTERING ROUTES ===');

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', newOrderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', phoneAuthRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/test', testRoutes);

console.log('=== ROUTES REGISTERED ===');

// Add a middleware to check database connection for API routes
const checkDatabaseConnection = (req, res, next) => {
  // Skip database check for health and test endpoints
  if (req.path === '/health' || req.path.startsWith('/test')) {
    return next();
  }
  
  // For API routes, check if database is connected
  if (!databaseConnected && req.path.startsWith('/api')) {
    return res.status(503).json({ 
      status: 'Service Unavailable', 
      message: 'Database connection unavailable',
      details: 'The database is not connected. Please check the database configuration.'
    });
  }
  
  next();
};

// Apply database connection check middleware AFTER routes are registered
app.use('/api', checkDatabaseConnection);

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running correctly',
    timestamp: new Date().toISOString(),
    database: databaseConnected ? 'connected' : 'disconnected',
    serverReady: serverReady,
    port: PORT
  });
});

// Add 404 handler for unmatched routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.url
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== TEST SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server Started on http://0.0.0.0:${PORT}`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`Items endpoint: http://0.0.0.0:${PORT}/api/items`);
  console.log(`====================================`);
});