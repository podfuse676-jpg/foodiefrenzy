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
    // Rating system
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    // Legacy fields (kept for backward compatibility)
    rating: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    imageUrl: { type: String },
    // Add size options
    sizeOptions: { type: [sizeOptionSchema], default: [] }
}, { timestamps: true });

// Add validation middleware
itemSchema.pre('save', function(next) {
    console.log('Pre-save middleware called for item:', this.name);
    
    // Ensure arrays are properly formatted
    if (this.modifierGroups && !Array.isArray(this.modifierGroups)) {
        console.log('Converting modifierGroups to array');
        this.modifierGroups = [];
    }
    if (this.printerLabels && !Array.isArray(this.printerLabels)) {
        console.log('Converting printerLabels to array');
        this.printerLabels = [];
    }
    if (this.flavourOptions && !Array.isArray(this.flavourOptions)) {
        console.log('Converting flavourOptions to array');
        this.flavourOptions = [];
    }
    
    // Ensure numeric fields are numbers
    const numericFields = ['price', 'taxRate', 'gst', 'cost', 'quantity', 'rating', 'hearts', 'total'];
    numericFields.forEach(field => {
        if (this[field] !== undefined && typeof this[field] !== 'number') {
            console.log(`Converting ${field} to number:`, this[field]);
            this[field] = Number(this[field]) || 0;
        }
    });
    
    // Ensure boolean fields are booleans
    const booleanFields = ['hidden', 'nonRevenue'];
    booleanFields.forEach(field => {
        if (this[field] !== undefined && typeof this[field] !== 'boolean') {
            console.log(`Converting ${field} to boolean:`, this[field]);
            this[field] = this[field] === 'true' || this[field] === true;
        }
    });
    
    next();
});

// Add validation middleware for updates
itemSchema.pre('findOneAndUpdate', function(next) {
    console.log('Pre-findOneAndUpdate middleware called');
    const update = this.getUpdate();
    console.log('Update data:', update);
    
    // Ensure arrays are properly formatted
    if (update.modifierGroups && !Array.isArray(update.modifierGroups)) {
        console.log('Converting modifierGroups to array in update');
        if (typeof update.modifierGroups === 'string') {
            try {
                update.modifierGroups = JSON.parse(update.modifierGroups);
            } catch {
                update.modifierGroups = update.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else {
            update.modifierGroups = [];
        }
    }
    
    if (update.printerLabels && !Array.isArray(update.printerLabels)) {
        console.log('Converting printerLabels to array in update');
        if (typeof update.printerLabels === 'string') {
            try {
                update.printerLabels = JSON.parse(update.printerLabels);
            } catch {
                update.printerLabels = update.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else {
            update.printerLabels = [];
        }
    }
    
    if (update.flavourOptions && !Array.isArray(update.flavourOptions)) {
        console.log('Converting flavourOptions to array in update');
        if (typeof update.flavourOptions === 'string') {
            try {
                update.flavourOptions = JSON.parse(update.flavourOptions);
            } catch {
                update.flavourOptions = update.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else {
            update.flavourOptions = [];
        }
    }
    
    // Ensure numeric fields are numbers
    const numericFields = ['price', 'taxRate', 'gst', 'cost', 'quantity', 'rating', 'hearts', 'total'];
    numericFields.forEach(field => {
        if (update[field] !== undefined && typeof update[field] !== 'number') {
            console.log(`Converting ${field} to number in update:`, update[field]);
            update[field] = Number(update[field]) || 0;
        }
    });
    
    // Ensure boolean fields are booleans
    const booleanFields = ['hidden', 'nonRevenue'];
    booleanFields.forEach(field => {
        if (update[field] !== undefined && typeof update[field] !== 'boolean') {
            console.log(`Converting ${field} to boolean in update:`, update[field]);
            update[field] = update[field] === 'true' || update[field] === true;
        }
    });
    
    next();
});

// Create a compound unique index on name and category
itemSchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model('Item', itemSchema);