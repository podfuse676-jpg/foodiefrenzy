import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database connection
import { connectDB } from './config/db.js';

// Import routes
import itemRoutes from './routes/itemRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import userRoutes from './routes/userRoute.js';
import phoneAuthRoutes from './routes/phoneAuthRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', phoneAuthRoutes);

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Server is running!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});