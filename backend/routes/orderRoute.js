import express from 'express';
import {
    createOrder,
    getOrders,
    getAllOrders,
    confirmPayment,
    getOrderById,
    updateOrder,
    updateAnyOrder
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const orderRouter = express.Router();

// Public routes (no auth required)
orderRouter.get('/getall', getAllOrders);

// Protected routes (auth required)
orderRouter.use(authMiddleware);

// Order routes
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.post('/confirm', confirmPayment);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);

// Admin-only routes
orderRouter.put('/getall/:id', updateAnyOrder);

export default orderRouter;