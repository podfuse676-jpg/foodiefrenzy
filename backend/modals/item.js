import mongoose from 'mongoose';

const sizeOptionSchema = new mongoose.Schema({
    size: { type: String, required: true },
    price: { type: Number, required: true },
    sku: { type: String }
});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: { type: String },
    priceUnit: { type: String },
    taxRate: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    productCode: { type: String },
    sku: { type: String },
    modifierGroups: { type: [String], default: [] },
    quantity: { type: Number, default: 0 },
    printerLabels: { type: [String], default: [] },
    hidden: { type: Boolean, default: false },
    nonRevenue: { type: Boolean, default: false },
    flavourOptions: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    imageUrl: { type: String },
    // Add size options
    sizeOptions: { type: [sizeOptionSchema], default: [] }
}, { timestamps: true });

// Create a compound unique index on name and category
itemSchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model('Item', itemSchema);