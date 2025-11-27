// controllers/newOrderController.js
import Order from '../modals/order.js';

// GET /api/orders/my
// Requires JWT auth (req.user.id).
// Return all orders for that user, sorted by createdAt DESC, with:
// _id, createdAt, totalAmount, status, shippingAddress.name, and items.
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('_id createdAt total status items firstName lastName address city zipCode');

        // Format orders to match expected structure
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            createdAt: order.createdAt,
            total: order.total,
            status: order.paymentStatus,
            shippingAddress: {
                name: `${order.firstName} ${order.lastName}`
            },
            items: order.items.map(item => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            }))
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('getMyOrders error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// GET /api/orders/:id
// Requires JWT auth.
// Only allow access if the order's userId matches req.user.id.
// Return full order details.
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if the order belongs to the authenticated user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('getOrderById error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};