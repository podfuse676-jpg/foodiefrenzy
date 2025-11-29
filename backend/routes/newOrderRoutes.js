// routes/newOrderRoutes.js
import express from 'express';
import { getMyOrders, getOrderById } from '../controllers/newOrderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/orders/my
router.get('/my', getMyOrders);

// GET /api/orders/my/:id
router.get('/my/:id', getOrderById);

export default router;