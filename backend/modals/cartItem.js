import mongoose from 'mongoose';

const selectedSizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    price: { type: Number, required: true }
});

const cartItemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
        // Add selected size
        selectedSize: selectedSizeSchema
    },
    { timestamps: true }
);

// Add indexes for better query performance
// Index on user for faster cart queries
cartItemSchema.index({ user: 1 });

// Index on item for faster item-based queries
cartItemSchema.index({ item: 1 });

// Compound index on user and item for faster lookup of specific cart items
cartItemSchema.index({ user: 1, item: 1 });

export const CartItem = mongoose.model('CartItem', cartItemSchema);