import express from 'express';
import { 
  createReview, 
  getItemReviews, 
  getUserReviews, 
  deleteReview,
  getItemReviewStats
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a new review
router.post('/', createReview);

// Get reviews for a specific item
router.get('/item/:itemId', getItemReviews);

// Get reviews by the current user
router.get('/user', getUserReviews);

// Get review statistics for an item
router.get('/stats/:itemId', getItemReviewStats);

// Delete a review
router.delete('/:reviewId', deleteReview);

export default router;