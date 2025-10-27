import Item from '../modals/item.js';

export const createItem = async (req, res, next) => {
    try {
        const {
            name,
            description,
            category,
            price,
            priceType,
            priceUnit,
            taxRate,
            gst,
            cost,
            productCode,
            sku,
            modifierGroups,
            quantity,
            printerLabels,
            hidden,
            nonRevenue,
            flavourOptions,
            rating,
            hearts
        } = req.body;

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        // Parse arrays that may be sent as JSON strings
        const parsedModifierGroups = modifierGroups ? (typeof modifierGroups === 'string' ? JSON.parse(modifierGroups) : modifierGroups) : [];
        const parsedPrinterLabels = printerLabels ? (typeof printerLabels === 'string' ? JSON.parse(printerLabels) : printerLabels) : [];
        const parsedFlavourOptions = flavourOptions ? (typeof flavourOptions === 'string' ? JSON.parse(flavourOptions) : flavourOptions) : [];

        const total = Number(price) || 0;

        const newItem = new Item({
            name,
            description,
            category,
            price: Number(price) || 0,
            priceType,
            priceUnit,
            taxRate: Number(taxRate) || 0,
            gst: Number(gst) || 0,
            cost: Number(cost) || 0,
            productCode,
            sku,
            modifierGroups: parsedModifierGroups,
            quantity: Number(quantity) || 0,
            printerLabels: parsedPrinterLabels,
            hidden: hidden === 'true' || hidden === true,
            nonRevenue: nonRevenue === 'true' || nonRevenue === true,
            flavourOptions: parsedFlavourOptions,
            rating: Number(rating) || 0,
            hearts: Number(hearts) || 0,
            imageUrl,
            total,
        });

        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Item name already exists' });
        } else next(err);
    }
};

export const getItems = async (_req, res, next) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        // Prefix image URLs with host for absolute path
        const host = `${_req.protocol}://${_req.get('host')}`;
        const withFullUrl = items.map(i => ({
            ...i.toObject(),
            imageUrl: i.imageUrl ? host + i.imageUrl : '',
        }));
        res.json(withFullUrl);
    } catch (err) {
        next(err);
    }
};

export const deleteItem = async (req, res, next) => {
    try {
        const removed = await Item.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Item not found' });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };

        console.log('Update request for item:', id);
        console.log('Request body:', req.body);
        console.log('File uploaded:', req.file);

        // Parse arrays if sent as JSON strings
        if (updateData.modifierGroups && typeof updateData.modifierGroups === 'string') {
            try { 
                updateData.modifierGroups = JSON.parse(updateData.modifierGroups); 
            } catch { 
                updateData.modifierGroups = updateData.modifierGroups.split(',').map(s => s.trim()).filter(Boolean); 
            }
        }
        if (updateData.printerLabels && typeof updateData.printerLabels === 'string') {
            try { 
                updateData.printerLabels = JSON.parse(updateData.printerLabels); 
            } catch { 
                updateData.printerLabels = updateData.printerLabels.split(',').map(s => s.trim()).filter(Boolean); 
            }
        }
        if (updateData.flavourOptions && typeof updateData.flavourOptions === 'string') {
            try { 
                updateData.flavourOptions = JSON.parse(updateData.flavourOptions); 
            } catch { 
                updateData.flavourOptions = updateData.flavourOptions.split(',').map(s => s.trim()).filter(Boolean); 
            }
        }

        // Convert boolean-like strings
        if (updateData.hidden === 'true' || updateData.hidden === 'false') {
            updateData.hidden = updateData.hidden === 'true';
        }
        if (updateData.nonRevenue === 'true' || updateData.nonRevenue === 'false') {
            updateData.nonRevenue = updateData.nonRevenue === 'true';
        }

        // Handle image upload path (req.file is set by multer in the route if used)
        if (req.file) {
            console.log('New image uploaded:', req.file.filename);
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        } else {
            console.log('No new image uploaded, keeping existing image');
            // If no new image is uploaded, don't update the imageUrl field
            delete updateData.imageUrl;
        }

        // Ensure numeric fields
        ['price','taxRate','gst','cost','quantity','rating','hearts','total'].forEach(k => {
            if (updateData[k] !== undefined) {
                updateData[k] = Number(updateData[k]) || 0;
            }
        });

        console.log('Update data to be saved:', updateData);

        // Validate that we have a valid item ID
        if (!id) {
            return res.status(400).json({ message: 'Item ID is required' });
        }

        const updated = await Item.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // Prefix image URL with host for absolute path
        const host = `${req.protocol}://${req.get('host')}`;
        const updatedWithFullUrl = {
            ...updated.toObject(),
            imageUrl: updated.imageUrl ? host + updated.imageUrl : '',
        };
        
        console.log('Updated item:', updatedWithFullUrl);
        res.json(updatedWithFullUrl);
    } catch (err) {
        console.error('Update item error:', err);
        console.error('Error stack:', err.stack);
        
        // Provide more specific error messages
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid item ID format' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error: ' + err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate item name in category' });
        }
        
        // Generic error response
        res.status(500).json({ 
            message: 'Failed to update item',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};