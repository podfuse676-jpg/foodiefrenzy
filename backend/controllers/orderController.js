// controllers/orderController.js
import 'dotenv/config';
import Stripe from 'stripe';
import Order from '../modals/order.js';

// Helper to get a Stripe client; returns null if key is not configured.
const getStripe = () => {
    const key = (process.env.STRIPE_SECRET_KEY || '').replace(/^['"]|['"]$/g, '').trim();
    if (!key) return null;
    return new Stripe(key);
};

// Create Order
export const createOrder = async (req, res) => {
    try {
        const {
            firstName, lastName, phone, email,
            address, city, zipCode,
            paymentMethod, subtotal, tax, total,
            deliveryCharge, codFee,
            items
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty items array' });
        }

        // Normalize incoming item structure
        const orderItems = items.map(({ item, name, price, imageUrl, quantity }) => {
            const base = item || {};
            return {
                item: {
                    name: base.name || name || 'Unknown',
                    price: Number(base.price ?? price) || 0,
                    imageUrl: base.imageUrl || imageUrl || ''
                },
                quantity: Number(quantity) || 0
            };
        });

        // Get shipping cost from request or default to $5 CAD
        const shippingCost = deliveryCharge || 5.00;
        let newOrder;

        if (paymentMethod === 'card') {
            const stripeClient = getStripe();
            if (!stripeClient) {
                return res.status(500).json({ message: 'Stripe not configured on server' });
            }
            
            // Create line items for Stripe - include delivery charge
            const lineItems = [
                ...orderItems.map(o => ({
                    price_data: {
                        currency: 'cad',
                        product_data: { name: o.item.name },
                        unit_amount: Math.round(o.item.price * 100)
                    },
                    quantity: o.quantity
                })),
                // Add delivery charge as a line item
                {
                    price_data: {
                        currency: 'cad',
                        product_data: { name: 'Delivery Charge' },
                        unit_amount: Math.round(shippingCost * 100)
                    },
                    quantity: 1
                },
                // Add tax as a line item
                {
                    price_data: {
                        currency: 'cad',
                        product_data: { name: 'GST (5%)' },
                        unit_amount: Math.round(tax * 100)
                    },
                    quantity: 1
                }
            ];
            
            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: lineItems,
                customer_email: email,
                success_url: `${process.env.FRONTEND_URL}/checkout?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
                metadata: { 
                    firstName, 
                    lastName, 
                    email, 
                    phone,
                    address,
                    city,
                    zipCode
                }
            });

            newOrder = new Order({
                user: req.user._id,
                firstName, lastName, phone, email,
                address, city, zipCode,
                paymentMethod, 
                subtotal, 
                tax, 
                total,
                shipping: shippingCost,
                codFee: 0,
                items: orderItems,
                paymentIntentId: session.payment_intent,
                sessionId: session.id,
                paymentStatus: 'pending'
            });

            await newOrder.save();
            return res.status(201).json({ order: newOrder, checkoutUrl: session.url });
        }

        // COD Handling - add COD fee
        const totalCodFee = codFee || 5.00;
        newOrder = new Order({
            user: req.user._id,
            firstName, lastName, phone, email,
            address, city, zipCode,
            paymentMethod, 
            subtotal, 
            tax, 
            total,
            shipping: shippingCost,
            codFee: totalCodFee,
            items: orderItems,
            paymentStatus: 'pending'
        });

        await newOrder.save();
        res.status(201).json({ order: newOrder, checkoutUrl: null });
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Confirm Payment
export const confirmPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

        const stripeClient = getStripe();
        if (!stripeClient) return res.status(500).json({ message: 'Stripe not configured on server' });
        
        const session = await stripeClient.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const order = await Order.findOneAndUpdate(
                { sessionId: sessionId },
                { paymentStatus: 'succeeded' },
                { new: true }
            );
            if (!order) return res.status(404).json({ message: 'Order not found' });
            return res.json(order);
        }
        return res.status(400).json({ message: 'Payment not completed' });
    } catch (err) {
        console.error('confirmPayment error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Orders
export const getOrders = async (req, res) => {
    try {
        // only return orders belonging to this user
        const filter = { user: req.user._id };
        const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();

        // Format for front-end
        const formatted = rawOrders.map(o => ({
            ...o,
            items: o.items.map(i => ({
                _id: i._id,
                item: i.item,
                quantity: i.quantity
            })),
            createdAt: o.createdAt,
            paymentStatus: o.paymentStatus
        }));

        res.json(formatted);
    } catch (error) {
        console.error('getOrders error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const raw = await Order
            .find({})
            .sort({ createdAt: -1 })
            .lean();

        const formatted = raw.map(o => ({
            _id: o._id,
            user: o.user,
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            phone: o.phone,

            // ← ADD these three:
            address: o.address ?? o.shippingAddress?.address ?? '',
            city: o.city ?? o.shippingAddress?.city ?? '',
            zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? '',

            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            status: o.status,
            createdAt: o.createdAt,

            items: o.items.map(i => ({
                _id: i._id,
                item: i.item,
                quantity: i.quantity
            }))
        }));

        res.json(formatted);
    } catch (error) {
        console.error('getAllOrders error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// NEW: updateAnyOrder — no ownership check
export const updateAnyOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updated);
    } catch (error) {
        console.error('updateAnyOrder error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Get Order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.query.email && order.email !== req.query.email) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(order);
    } catch (error) {
        console.error('getOrderById error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Order
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.body.email && order.email !== req.body.email) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        console.error('updateOrder error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};