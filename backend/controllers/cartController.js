import asyncHandler from 'express-async-handler';
import { CartItem } from '../modals/cartItem.js';

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
    const items = await CartItem.find({ user: req.user._id }).populate('item');
    // Return exactly { _id, item, quantity } so frontend can use ._id
    const formatted = items.map(ci => ({
        _id: ci._id.toString(),
        item: ci.item,
        quantity: ci.quantity,
        selectedSize: ci.selectedSize
    }));
    res.json(formatted);
});

// POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity, selectedSize } = req.body;
    if (!itemId || typeof quantity !== 'number') {
        res.status(400);
        throw new Error('itemId and quantity (number) are required');
    }

    // Build query to find existing cart item
    const query = { user: req.user._id, item: itemId };
    if (selectedSize) {
        query['selectedSize.size'] = selectedSize.size;
    } else {
        // If no size selected, look for items without selectedSize or with null selectedSize
        query.selectedSize = { $exists: false };
    }

    let cartItem = await CartItem.findOne(query);

    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + quantity);
        if (cartItem.quantity < 1) {
            await cartItem.remove();
            return res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: 0, selectedSize: cartItem.selectedSize });
        }
        await cartItem.save();
        await cartItem.populate('item');
        return res.status(200).json({
            _id: cartItem._id.toString(),
            item: cartItem.item,
            quantity: cartItem.quantity,
            selectedSize: cartItem.selectedSize
        });
    }

    // Create new cart item
    const cartItemData = {
        user: req.user._id,
        item: itemId,
        quantity,
    };

    // Add selected size if provided
    if (selectedSize) {
        cartItemData.selectedSize = selectedSize;
    }

    cartItem = await CartItem.create(cartItemData);
    await cartItem.populate('item');
    res.status(201).json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
        selectedSize: cartItem.selectedSize
    });
});

// PUT /api/cart/:id
export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity, selectedSize } = req.body;
    const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }
    cartItem.quantity = Math.max(1, quantity);
    
    // Update selected size if provided
    if (selectedSize) {
        cartItem.selectedSize = selectedSize;
    }
    
    await cartItem.save();
    await cartItem.populate('item');
    res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
        selectedSize: cartItem.selectedSize
    });
});

// DELETE /api/cart/:id
export const deleteCartItem = asyncHandler(async (req, res) => {
    const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }
    await cartItem.deleteOne();
    res.json({ _id: req.params.id });
});

// POST /api/cart/clear
export const clearCart = asyncHandler(async (req, res) => {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
});