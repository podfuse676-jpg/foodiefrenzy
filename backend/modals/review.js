import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Link to the item being reviewed
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true
  },
  
  // Link to the user who made the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Link to the order (to verify purchase)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  
  // Review title
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Review comment
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Review helpfulness counters
  helpful: {
    type: Number,
    default: 0
  },
  
  notHelpful: {
    type: Number,
    default: 0
  },
  
  // Verification status
  verifiedPurchase: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for getting reviews for a specific item
reviewSchema.index({ item: 1, createdAt: -1 });

// Index for getting reviews by a specific user
reviewSchema.index({ user: 1, createdAt: -1 });

// Index for getting reviews for a specific order
reviewSchema.index({ order: 1 });

// Ensure a user can only review an item once per order
reviewSchema.index({ item: 1, user: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);