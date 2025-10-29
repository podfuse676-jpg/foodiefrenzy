import Review from '../modals/review.js';
import Item from '../modals/item.js';
import Order from '../modals/order.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { itemId, orderId, rating, title, comment } = req.body;
    const userId = req.user._id;

    console.log('Creating review:', { itemId, orderId, userId, rating, title, comment });

    // Validate required fields
    if (!itemId || !orderId || !rating || !title || !comment) {
      return res.status(400).json({ 
        message: 'Missing required fields: itemId, orderId, rating, title, and comment are required' 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if the user purchased this item in the specified order
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      'items.item.name': { $exists: true }
    });

    if (!order) {
      return res.status(400).json({ 
        message: 'Order not found or does not belong to this user' 
      });
    }

    // Check if the item exists in the order
    const orderItem = order.items.find(item => 
      item.item && item.item._id && item.item._id.toString() === itemId
    ) || order.items.find(item => 
      item.item && item.item.id && item.item.id.toString() === itemId
    );

    if (!orderItem) {
      // Try to find by name as fallback
      const itemDoc = await Item.findById(itemId);
      if (!itemDoc) {
        return res.status(400).json({ 
          message: 'Item not found' 
        });
      }

      const orderItemByName = order.items.find(item => 
        item.item && item.item.name === itemDoc.name
      );

      if (!orderItemByName) {
        return res.status(400).json({ 
          message: 'Item not found in this order. You can only review items you have purchased.' 
        });
      }
    }

    // Check if user has already reviewed this item for this order
    const existingReview = await Review.findOne({
      item: itemId,
      user: userId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this item for this order' 
      });
    }

    // Create the review
    const review = new Review({
      item: itemId,
      user: userId,
      order: orderId,
      rating,
      title,
      comment,
      verifiedPurchase: true
    });

    const savedReview = await review.save();
    console.log('Review created successfully:', savedReview._id);

    // Update the item's rating
    await updateItemRating(itemId);

    res.status(201).json({
      message: 'Review created successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Failed to create review',
      error: error.message 
    });
  }
};

// Get reviews for a specific item
export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    console.log('Fetching reviews for item:', itemId);

    // Validate item ID
    if (!itemId) {
      return res.status(400).json({ 
        message: 'Item ID is required' 
      });
    }

    // Fetch reviews with pagination
    const reviews = await Review.find({ item: itemId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Review.countDocuments({ item: itemId });

    console.log(`Found ${reviews.length} reviews for item ${itemId}`);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews',
      error: error.message 
    });
  }
};

// Get reviews by a specific user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    console.log('Fetching reviews for user:', userId);

    // Fetch reviews with pagination
    const reviews = await Review.find({ user: userId })
      .populate('item', 'name imageUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Review.countDocuments({ user: userId });

    console.log(`Found ${reviews.length} reviews for user ${userId}`);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user reviews',
      error: error.message 
    });
  }
};

// Update item rating based on all reviews
export const updateItemRating = async (itemId) => {
  try {
    // Get all reviews for this item
    const reviews = await Review.find({ item: itemId });
    
    if (reviews.length === 0) {
      // If no reviews, set rating to 0
      await Item.findByIdAndUpdate(itemId, { 
        rating: 0,
        total: 0
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    console.log(`Updating item ${itemId} rating to ${averageRating} based on ${reviews.length} reviews`);

    // Update the item with new rating
    await Item.findByIdAndUpdate(itemId, { 
      rating: averageRating,
      total: reviews.length
    });
  } catch (error) {
    console.error('Error updating item rating:', error);
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    console.log('Deleting review:', reviewId, 'by user:', userId);

    // Find the review and ensure it belongs to the user
    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({ 
        message: 'Review not found or you do not have permission to delete it' 
      });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    // Update the item's rating
    await updateItemRating(review.item);

    console.log('Review deleted successfully:', reviewId);

    res.json({ 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Failed to delete review',
      error: error.message 
    });
  }
};

// Get review statistics for an item
export const getItemReviewStats = async (req, res) => {
  try {
    const { itemId } = req.params;

    console.log('Fetching review stats for item:', itemId);

    // Validate item ID
    if (!itemId) {
      return res.status(400).json({ 
        message: 'Item ID is required' 
      });
    }

    // Get all reviews for this item
    const reviews = await Review.find({ item: itemId });

    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    res.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch review statistics',
      error: error.message 
    });
  }
};