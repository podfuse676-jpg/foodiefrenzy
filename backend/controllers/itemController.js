export const updateItem = async (req, res, next) => {
    try {
        console.log('=== UPDATE ITEM REQUEST ===');
        console.log('Request params:', req.params);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Request file:', req.file);
        console.log('Request headers:', req.headers);
        
        const id = req.params.id;
        const updateData = { ...req.body };

        console.log('Update request for item:', id);
        console.log('Request body:', req.body);
        console.log('File uploaded:', req.file);

        // Validate item ID
        if (!id) {
            console.log('ERROR: Item ID is missing');
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Parse arrays if sent as JSON strings
        if (updateData.modifierGroups && typeof updateData.modifierGroups === 'string') {
            try { 
                console.log('Parsing modifierGroups as JSON');
                updateData.modifierGroups = JSON.parse(updateData.modifierGroups); 
                console.log('Parsed modifierGroups:', updateData.modifierGroups);
            } catch (parseError) { 
                console.log('Failed to parse modifierGroups as JSON, splitting by comma');
                updateData.modifierGroups = updateData.modifierGroups.split(',').map(s => s.trim()).filter(Boolean); 
                console.log('Split modifierGroups:', updateData.modifierGroups);
            }
        }
        if (updateData.printerLabels && typeof updateData.printerLabels === 'string') {
            try { 
                console.log('Parsing printerLabels as JSON');
                updateData.printerLabels = JSON.parse(updateData.printerLabels); 
                console.log('Parsed printerLabels:', updateData.printerLabels);
            } catch (parseError) { 
                console.log('Failed to parse printerLabels as JSON, splitting by comma');
                updateData.printerLabels = updateData.printerLabels.split(',').map(s => s.trim()).filter(Boolean); 
                console.log('Split printerLabels:', updateData.printerLabels);
            }
        }
        if (updateData.flavourOptions && typeof updateData.flavourOptions === 'string') {
            try { 
                console.log('Parsing flavourOptions as JSON');
                updateData.flavourOptions = JSON.parse(updateData.flavourOptions); 
                console.log('Parsed flavourOptions:', updateData.flavourOptions);
            } catch (parseError) { 
                console.log('Failed to parse flavourOptions as JSON, splitting by comma');
                updateData.flavourOptions = updateData.flavourOptions.split(',').map(s => s.trim()).filter(Boolean); 
                console.log('Split flavourOptions:', updateData.flavourOptions);
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
            console.log('No new image uploaded, keeping existing image');
            // If no new image is uploaded, don't update the imageUrl field
            delete updateData.imageUrl;
        }

        // Ensure numeric fields
        ['price','taxRate','gst','cost','quantity','rating','hearts','total'].forEach(k => {
            if (updateData[k] !== undefined) {
                console.log(`Converting ${k} to number:`, updateData[k]);
                updateData[k] = Number(updateData[k]) || 0;
            }
        });

        console.log('Final update data to be saved:', updateData);

        // Validate that we have a valid item ID
        if (!id) {
            console.log('ERROR: Item ID is missing');
            return res.status(400).json({ message: 'Item ID is required' });
        }

        console.log('Attempting to find and update item with ID:', id);
        const updated = await Item.findByIdAndUpdate(id, updateData, { new: true });
        console.log('Find and update result:', updated ? 'Found' : 'Not found');
        
        if (!updated) {
            console.log('ERROR: Item not found with ID:', id);
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // Prefix image URL with host for absolute path
        const host = `${req.protocol}://${req.get('host')}`;
        const updatedWithFullUrl = {
            ...updated.toObject(),
            imageUrl: updated.imageUrl ? host + updated.imageUrl : '',
        };
        
        console.log('Updated item with full URL:', updatedWithFullUrl);
        res.json(updatedWithFullUrl);
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