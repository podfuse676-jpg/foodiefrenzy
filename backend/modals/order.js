// models/order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  pincode: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Order Items
  items: [orderItemSchema],
  
  // Order Calculations
  totalAmount: { type: Number, required: true, min: 0 },
  
  // Order Status
  status: {
    type: String,
    enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED',
    index: true
  },
  
  // Shipping Address
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  }
  
}, { 
  timestamps: true 
});

// Add indexes on userId and createdAt
orderSchema.index({ userId: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;