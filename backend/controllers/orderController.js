// controllers/orderController.js
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import Order from '../modals/order.js';

// Helper to get a Stripe client; returns null if key is not configured.
const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'your_stripe_secret_key_here' || key.startsWith('your_stripe')) {
        console.error('Stripe key not found or is still placeholder value in environment variables');
        return null;
    }
    try {
        console.log('Initializing Stripe with key:', key.substring(0, 8) + '...');
        return new Stripe(key, {
            apiVersion: '2023-10-16'
        });
    } catch (error) {
        console.error('Error initializing Stripe client:', error.message);
        return null;
    }
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
                console.error('Stripe not configured on server - stripeClient is null');
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
            
            // Use FRONTEND_URL from environment variables or default to Vercel deployment
            const frontendUrl = process.env.FRONTEND_URL || 'https://frontend-me6ivkq5o-podfuse676-6967s-projects.vercel.app';
            console.log('Using frontend URL for Stripe redirect:', frontendUrl);
            
            const successUrl = `${frontendUrl}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${frontendUrl}/checkout?payment_status=cancel`;
            
            console.log('Stripe success URL:', successUrl);
            console.log('Stripe cancel URL:', cancelUrl);
            
            try {
                const session = await stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: lineItems,
                    customer_email: email,
                    success_url: successUrl,
                    cancel_url: cancelUrl,
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
            } catch (stripeError) {
                console.error('Stripe API error:', stripeError);
                return res.status(500).json({ 
                    message: 'Payment processing error', 
                    error: stripeError.message,
                    stripeError: {
                        type: stripeError.type,
                        code: stripeError.code,
                        decline_code: stripeError.decline_code
                    }
                });
            }
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
        // Return the order object directly for COD
        res.status(201).json({ order: newOrder });
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Confirm Payment
export const confirmPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        console.log('confirmPayment called with sessionId:', sessionId);
        
        if (!sessionId) {
            console.log('Session ID is missing');
            return res.status(400).json({ message: 'sessionId required' });
        }

        const stripeClient = getStripe();
        if (!stripeClient) {
            console.log('Stripe client not initialized');
            return res.status(500).json({ message: 'Stripe not configured on server' });
        }
        
        console.log('Retrieving Stripe session:', sessionId);
        try {
            const session = await stripeClient.checkout.sessions.retrieve(sessionId);
            console.log('Stripe session retrieved. Payment status:', session.payment_status);
            // Log key session properties for debugging
            console.log('Session details - id:', session.id, 'status:', session.payment_status, 'mode:', session.mode);
            
            // Add more detailed logging
            console.log('Session payment_intent:', session.payment_intent);
            console.log('Session customer_details:', session.customer_details);
            
            // In production, only accept 'paid' status
            const isPaymentSuccessful = session.payment_status === 'paid';
            
            if (isPaymentSuccessful) {
                console.log('Payment successful, updating order with sessionId:', sessionId);
                
                // First, let's see if we can find the order
                const existingOrder = await Order.findOne({ sessionId: sessionId });
                console.log('Existing order found:', !!existingOrder);
                if (existingOrder) {
                    console.log('Existing order paymentStatus:', existingOrder.paymentStatus);
                    console.log('Existing order status:', existingOrder.status);
                }
                
                const order = await Order.findOneAndUpdate(
                    { sessionId: sessionId },
                    { 
                        paymentStatus: 'succeeded',
                        // Update the order status to processing since payment is complete
                        status: 'processing'
                    },
                    { new: true }
                );
                console.log('Order update result:', order);
                
                if (!order) {
                    console.log('Order not found for sessionId:', sessionId);
                    return res.status(404).json({ message: 'Order not found' });
                }
                return res.json(order);
            }
            
            // If payment was not successful, update the order status to failed
            if (session.payment_status === 'unpaid') {
                console.log('Payment not completed, updating order status to failed');
                await Order.findOneAndUpdate(
                    { sessionId: sessionId },
                    { paymentStatus: 'failed' },
                    { new: true }
                );
            }
            
            console.log('Payment not completed, status:', session.payment_status);
            return res.status(400).json({ message: 'Payment not completed' });
        } catch (stripeError) {
            console.error('Stripe API error during session retrieval:', stripeError);
            return res.status(500).json({ 
                message: 'Payment verification error', 
                error: stripeError.message,
                stripeError: {
                    type: stripeError.type,
                    code: stripeError.code
                }
            });
        }
    } catch (err) {
        console.error('confirmPayment error:', err);
        // In case of an error, we might want to mark the order as failed
        if (req.body.sessionId) {
            try {
                await Order.findOneAndUpdate(
                    { sessionId: req.body.sessionId },
                    { paymentStatus: 'failed' },
                    { new: true }
                );
            } catch (updateErr) {
                console.error('Error updating order status to failed:', updateErr);
            }
        }
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