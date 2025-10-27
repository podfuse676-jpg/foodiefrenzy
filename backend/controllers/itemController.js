export const getItems = async (req, res, next) => {
    try {
        console.log('Fetching all items');
        const items = await Item.find({});
        
        // For each item, ensure the imageUrl is correctly formatted
        const itemsWithFullUrls = items.map(item => {
            const itemObj = item.toObject();
            
            // If imageUrl is already an absolute URL, use it as is
            // Otherwise, prefix with host for relative paths
            if (itemObj.imageUrl && !itemObj.imageUrl.startsWith('http')) {
                const host = `${req.protocol}://${req.get('host')}`;
                itemObj.imageUrl = host + itemObj.imageUrl;
            }
            
            return itemObj;
        });
        
        console.log(`Found ${itemsWithFullUrls.length} items`);
        res.json(itemsWithFullUrls);
    } catch (err) {
        console.error('Get items error:', err);
        next(err);
    }
};

export const getItemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Getting item by ID:', id);
        
        const item = await Item.findById(id);
        if (!item) {
            console.log('Item not found with ID:', id);
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // Prefix image URL with host for absolute path if it's a relative path
        const itemObj = item.toObject();
        if (itemObj.imageUrl && !itemObj.imageUrl.startsWith('http')) {
            const host = `${req.protocol}://${req.get('host')}`;
            itemObj.imageUrl = host + itemObj.imageUrl;
        }
        
        console.log('Found item:', itemObj.name);
        res.json(itemObj);
    } catch (err) {
        console.error('Get item by ID error:', err);
        next(err);
    }
};

export const createItem = async (req, res, next) => {
    try {
        console.log('Creating new item');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const itemData = { ...req.body };

        // Parse arrays if sent as JSON strings
        ['modifierGroups', 'printerLabels', 'flavourOptions'].forEach(key => {
            if (itemData[key] !== undefined) {
                if (typeof itemData[key] === 'string') {
                    try { 
                        itemData[key] = JSON.parse(itemData[key]); 
                    } catch (parseError) { 
                        itemData[key] = itemData[key].split(',').map(s => s.trim()).filter(Boolean); 
                    }
                }
            }
        });

        // Convert boolean-like strings
        ['hidden', 'nonRevenue'].forEach(key => {
            if (itemData[key] === 'true' || itemData[key] === 'false') {
                itemData[key] = itemData[key] === 'true';
            }
        });

        // Ensure numeric fields
        ['price','taxRate','gst','cost','quantity','rating','hearts','total'].forEach(k => {
            if (itemData[k] !== undefined) {
                itemData[k] = Number(itemData[k]) || 0;
            }
        });

        // Handle image upload path (req.file is set by multer in the route if used)
        if (req.file) {
            console.log('New image uploaded:', req.file.filename);
            itemData.imageUrl = `/uploads/${req.file.filename}`;
        }

        console.log('Item data to be saved:', itemData);

        const newItem = new Item(itemData);
        const savedItem = await newItem.save();
        
        // Prefix image URL with host for absolute path if it's a relative path
        const savedItemObj = savedItem.toObject();
        if (savedItemObj.imageUrl && !savedItemObj.imageUrl.startsWith('http')) {
            const host = `${req.protocol}://${req.get('host')}`;
            savedItemObj.imageUrl = host + savedItemObj.imageUrl;
        }
        
        console.log('New item created:', savedItemObj);
        res.status(201).json(savedItemObj);
    } catch (err) {
        console.error('Create item error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate item name in category' });
        }
        res.status(500).json({ message: 'Failed to create item', error: err.message });
    }
};

export const updateItem = async (req, res, next) => {
    try {
        console.log('=== UPDATE ITEM REQUEST ===');
        console.log('Request params:', req.params);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request headers:', req.headers);
        
        const id = req.params.id;
        const updateData = { ...req.body };

        console.log('Update request for item:', id);
        console.log('Raw request body:', req.body);

        // Validate item ID
        if (!id) {
            console.log('ERROR: Item ID is missing');
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Log the raw values before parsing
        console.log('Raw modifierGroups:', updateData.modifierGroups);
        console.log('Raw printerLabels:', updateData.printerLabels);
        console.log('Raw flavourOptions:', updateData.flavourOptions);
        console.log('Raw hidden:', updateData.hidden);
        console.log('Raw nonRevenue:', updateData.nonRevenue);

        // Parse arrays if sent as JSON strings
        if (updateData.modifierGroups !== undefined) {
            if (typeof updateData.modifierGroups === 'string') {
                try { 
                    console.log('Parsing modifierGroups as JSON');
                    updateData.modifierGroups = JSON.parse(updateData.modifierGroups); 
                    console.log('Parsed modifierGroups:', updateData.modifierGroups);
                } catch (parseError) { 
                    console.log('Failed to parse modifierGroups as JSON, splitting by comma');
                    updateData.modifierGroups = updateData.modifierGroups.split(',').map(s => s.trim()).filter(Boolean); 
                    console.log('Split modifierGroups:', updateData.modifierGroups);
                }
            } else {
                console.log('modifierGroups is already an array or other type:', typeof updateData.modifierGroups);
            }
        }
        
        if (updateData.printerLabels !== undefined) {
            if (typeof updateData.printerLabels === 'string') {
                try { 
                    console.log('Parsing printerLabels as JSON');
                    updateData.printerLabels = JSON.parse(updateData.printerLabels); 
                    console.log('Parsed printerLabels:', updateData.printerLabels);
                } catch (parseError) { 
                    console.log('Failed to parse printerLabels as JSON, splitting by comma');
                    updateData.printerLabels = updateData.printerLabels.split(',').map(s => s.trim()).filter(Boolean); 
                    console.log('Split printerLabels:', updateData.printerLabels);
                }
            } else {
                console.log('printerLabels is already an array or other type:', typeof updateData.printerLabels);
            }
        }
        
        if (updateData.flavourOptions !== undefined) {
            if (typeof updateData.flavourOptions === 'string') {
                try { 
                    console.log('Parsing flavourOptions as JSON');
                    updateData.flavourOptions = JSON.parse(updateData.flavourOptions); 
                    console.log('Parsed flavourOptions:', updateData.flavourOptions);
                } catch (parseError) { 
                    console.log('Failed to parse flavourOptions as JSON, splitting by comma');
                    updateData.flavourOptions = updateData.flavourOptions.split(',').map(s => s.trim()).filter(Boolean); 
                    console.log('Split flavourOptions:', updateData.flavourOptions);
                }
            } else {
                console.log('flavourOptions is already an array or other type:', typeof updateData.flavourOptions);
            }
        }

        // Convert boolean-like strings
        if (updateData.hidden === 'true' || updateData.hidden === 'false') {
            console.log('Converting hidden field to boolean:', updateData.hidden);
            updateData.hidden = updateData.hidden === 'true';
        }
        if (updateData.nonRevenue === 'true' || updateData.nonRevenue === 'false') {
            console.log('Converting nonRevenue field to boolean:', updateData.nonRevenue);
            updateData.nonRevenue = updateData.nonRevenue === 'true';
        }

        // Handle image upload path (req.file is set by multer in the route if used)
        if (req.file) {
            console.log('New image uploaded:', req.file.filename);
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        } else {
            console.log('No new image uploaded, preserving existing image');
            // If no new image is uploaded, don't update the imageUrl field at all
            delete updateData.imageUrl;
        }

        // Ensure numeric fields
        ['price','taxRate','gst','cost','quantity','rating','hearts','total'].forEach(k => {
            if (updateData[k] !== undefined) {
                console.log(`Converting ${k} to number:`, updateData[k], 'Type:', typeof updateData[k]);
                updateData[k] = Number(updateData[k]) || 0;
            }
        });

        // Remove _id field if present (should not be updated)
        if (updateData._id) {
            console.log('Removing _id field from update data');
            delete updateData._id;
        }

        console.log('Final update data to be saved:', updateData);

        // Validate that we have a valid item ID
        if (!id) {
            console.log('ERROR: Item ID is missing');
            return res.status(400).json({ message: 'Item ID is required' });
        }

        console.log('Attempting to find and update item with ID:', id);
        // When returning the updated item, ensure the imageUrl is correctly formatted
        const updated = await Item.findByIdAndUpdate(id, updateData, { new: true });
        console.log('Find and update result:', updated ? 'Found' : 'Not found');
        
        if (!updated) {
            console.log('ERROR: Item not found with ID:', id);
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // Prefix image URL with host for absolute path if it's a relative path
        const updatedObj = updated.toObject();
        if (updatedObj.imageUrl && !updatedObj.imageUrl.startsWith('http')) {
            const host = `${req.protocol}://${req.get('host')}`;
            updatedObj.imageUrl = host + updatedObj.imageUrl;
        }
        
        console.log('Updated item with full URL:', updatedObj);
        res.json(updatedObj);
    } catch (err) {
        console.error('=== UPDATE ITEM ERROR ===');
        console.error('Update item error:', err);
        console.error('Error stack:', err.stack);
        
        // Provide more specific error messages
        if (err.name === 'CastError') {
            console.log('ERROR: Invalid item ID format');
            return res.status(400).json({ message: 'Invalid item ID format' });
        }
        if (err.name === 'ValidationError') {
            console.log('ERROR: Validation error');
            return res.status(400).json({ message: 'Validation error: ' + err.message });
        }
        if (err.code === 11000) {
            console.log('ERROR: Duplicate key error');
            return res.status(400).json({ message: 'Duplicate item name in category' });
        }
        
        // Generic error response
        console.log('ERROR: Generic internal server error');
        res.status(500).json({ 
            message: 'Failed to update item',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};
