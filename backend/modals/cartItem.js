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

export const CartItem = mongoose.model('CartItem', cartItemSchema);