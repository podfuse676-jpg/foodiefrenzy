// testNewOrderModel.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './modals/order.js';

dotenv.config();

const testOrderModel = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test order
    const testOrder = new Order({
      userId: new mongoose.Types.ObjectId(),
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

    // Save the order
    const savedOrder = await testOrder.save();
    console.log('Order saved successfully:', savedOrder._id);

    // Retrieve the order
    const retrievedOrder = await Order.findById(savedOrder._id);
    console.log('Order retrieved successfully:', retrievedOrder);

    // Test the indexes
    const userOrders = await Order.find({ userId: testOrder.userId }).sort({ createdAt: -1 });
    console.log('User orders found:', userOrders.length);

    // Clean up - delete the test order
    await Order.findByIdAndDelete(savedOrder._id);
    console.log('Test order deleted');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testOrderModel();