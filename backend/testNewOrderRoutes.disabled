// testNewOrderRoutes.js
import express from 'express';
import { authMiddleware } from './middleware/auth.js';
import Order from './modals/order.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// Mock auth middleware for testing
const mockAuth = (req, res, next) => {
  req.user = { id: '64f8a7b4c2e1a8d4f8e4a1b2' }; // Mock user ID
  next();
};

// Test route for GET /api/orders/my
app.get('/api/orders/my', mockAuth, async (req, res) => {
  try {
    console.log('GET /api/orders/my called with user ID:', req.user.id);
    
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('_id createdAt totalAmount status shippingAddress.name items');
    
    console.log('Found orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Error in GET /api/orders/my:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Test route for GET /api/orders/:id
app.get('/api/orders/:id', mockAuth, async (req, res) => {
  try {
    console.log('GET /api/orders/:id called with order ID:', req.params.id);
    console.log('User ID:', req.user.id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the authenticated user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    console.log('Order found:', order._id);
    res.json(order);
  } catch (error) {
    console.error('Error in GET /api/orders/:id:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Create a test order
const createTestOrder = async () => {
  try {
    const testOrder = new Order({
      userId: '64f8a7b4c2e1a8d4f8e4a1b2', // Same as mock user ID
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          name: 'Test Product',
          image: 'test-image.jpg',
          price: 29.99,
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'PLACED',
      shippingAddress: {
        name: 'John Doe',
        phone: '123-456-7890',
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        pincode: '10001'
      }
    });

    const savedOrder = await testOrder.save();
    console.log('Test order created with ID:', savedOrder._id);
    return savedOrder._id;
  } catch (error) {
    console.error('Error creating test order:', error);
    return null;
  }
};

// Start the test server
const startTest = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy');
    console.log('Connected to MongoDB');
    
    // Create a test order
    const orderId = await createTestOrder();
    if (!orderId) {
      console.error('Failed to create test order');
      process.exit(1);
    }
    
    // Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      console.log(`Test routes:`);
      console.log(`  GET http://localhost:${PORT}/api/orders/my`);
      console.log(`  GET http://localhost:${PORT}/api/orders/${orderId}`);
    });
  } catch (error) {
    console.error('Error starting test server:', error);
    process.exit(1);
  }
};

startTest();