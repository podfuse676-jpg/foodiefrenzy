// models/order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: false  // Make this optional to handle cases where we don't have a valid product ID
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  
  // Address Information
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  
  // Order Items
  items: [orderItemSchema],
  
  // Payment Information
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  codFee: { type: Number, default: 0 },
  
  // Stripe Information (for card payments)
  paymentIntentId: { type: String },
  sessionId: { type: String },
  
  // Order Status
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

// Add indexes
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;