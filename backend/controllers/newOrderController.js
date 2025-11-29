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
            .lean();

        // Format orders to match expected structure from the old controller
        const formattedOrders = orders.map(order => ({
            ...order,
            items: order.items?.map(item => ({
                _id: item._id,
                item: {
                    ...item.item,
                    imageUrl: item.item?.imageUrl || ''
                },
                quantity: item.quantity
            })) || [],
            createdAt: order.createdAt,
            paymentStatus: order.paymentStatus?.toLowerCase() || 'pending',
            firstName: order.firstName || '',
            lastName: order.lastName || '',
            address: order.address || '',
            city: order.city || '',
            zipCode: order.zipCode || '',
            phone: order.phone || '',
            email: order.email || '',
            total: order.total || 0,
            subtotal: order.subtotal || 0,
            tax: order.tax || 0,
            shipping: order.shipping || 0,
            codFee: order.codFee || 0,
            paymentMethod: order.paymentMethod || 'cod',
            status: order.status || 'processing'
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
        
        // Format order to match expected structure
        const formattedOrder = {
            ...order.toObject(),
            items: order.items?.map(item => ({
                _id: item._id,
                item: {
                    ...item.item,
                    imageUrl: item.item?.imageUrl || ''
                },
                quantity: item.quantity
            })) || [],
            createdAt: order.createdAt,
            paymentStatus: order.paymentStatus?.toLowerCase() || 'pending',
            firstName: order.firstName || '',
            lastName: order.lastName || '',
            address: order.address || '',
            city: order.city || '',
            zipCode: order.zipCode || '',
            phone: order.phone || '',
            email: order.email || '',
            total: order.total || 0,
            subtotal: order.subtotal || 0,
            tax: order.tax || 0,
            shipping: order.shipping || 0,
            codFee: order.codFee || 0,
            paymentMethod: order.paymentMethod || 'cod',
            status: order.status || 'processing'
        };
        
        res.json(formattedOrder);
    } catch (error) {
        console.error('getOrderById error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};