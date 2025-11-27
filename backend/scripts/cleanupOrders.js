// scripts/cleanupOrders.js
// Script to remove all old orders and ensure proper user association

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../modals/order.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const cleanupOrders = async () => {
  try {
    await connectDB();
    
    // Remove all orders (clean slate)
    const result = await Order.deleteMany({});
    console.log(`Removed ${result.deletedCount} orders`);
    
    console.log('All orders have been removed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up orders:', error);
    process.exit(1);
  }
};

cleanupOrders();