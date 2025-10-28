export const updateItem = async (req, res, next) => {
    try {
        console.log('=== UPDATE ITEM REQUEST ===');
        console.log('Request params:', req.params);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        
        // Log the raw request body if possible
        if (req.body && typeof req.body === 'object') {
            console.log('Request body (detailed):', JSON.stringify(req.body, null, 2));
        }
        
        const id = req.params.id;
        const updateData = { ...req.body };

        console.log('Update request for item:', id);
        console.log('Raw request body:', req.body);

        // Validate item ID
        if (!id) {
            console.log('ERROR: Item ID is missing');
            return res.status(400).json({ message: 'Item ID is required' });
        }

        // Detailed ID validation
        console.log('=== DETAILED ID VALIDATION ===');
        console.log('ID value:', id);
        console.log('ID type:', typeof id);
        console.log('ID length:', id.length);
        console.log('ID char codes:', [...id].map(c => c.charCodeAt(0)));
        console.log('ID char details:', [...id].map((c, i) => ({ index: i, char: c, code: c.charCodeAt(0) })));
        
        // Check for hidden characters or whitespace
        const trimmedId = id.trim();
        console.log('Trimmed ID:', trimmedId);
        console.log('ID equals trimmed ID:', id === trimmedId);
        
        // Validate that the ID is a valid MongoDB ObjectId format
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        const isValidFormat = objectIdRegex.test(id);
        console.log('ID format valid (regex test):', isValidFormat);
        
        if (!isValidFormat) {
            console.log('ERROR: Invalid item ID format');
            console.log('Problematic ID value:', id);
            console.log('ID length:', id ? id.length : 0);
            return res.status(400).json({ 
                message: 'Invalid item ID format',
                details: `The provided ID "${id}" is not a valid MongoDB ObjectId. It should be 24 hexadecimal characters.`,
                debug: {
                    id: id,
                    length: id.length,
                    charCodes: [...id].map(c => c.charCodeAt(0)),
                    trimmedId: trimmedId,
                    trimmedEqualsOriginal: id === trimmedId,
                    regexTest: isValidFormat
                }
            });
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
            console.log('New image uploaded:', req.file);
            console.log('File details - fieldname:', req.file.fieldname);
            console.log('File details - originalname:', req.file.originalname);
            console.log('File details - mimetype:', req.file.mimetype);
            console.log('File details - size:', req.file.size);
            
            // For Cloudinary, the secure_url is the full URL to the image
            if (req.file.secure_url) {
                updateData.imageUrl = req.file.secure_url;
                console.log('Cloudinary secure_url:', req.file.secure_url);
            } else if (req.file.path) {
                // Fallback for local storage
                updateData.imageUrl = `/uploads/${req.file.filename}`;
                console.log('Local file path:', `/uploads/${req.file.filename}`);
            }
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

        console.log('Final update data to be saved:', JSON.stringify(updateData, null, 2));

        console.log('Attempting to find and update item with ID:', id);
        // When returning the updated item, ensure the imageUrl is correctly formatted
        const updated = await Item.findByIdAndUpdate(id, updateData, { new: true });
        console.log('Find and update result:', updated ? 'Found' : 'Not found');
        
        if (!updated) {
            console.log('ERROR: Item not found with ID:', id);
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // For Cloudinary URLs, they should already be full URLs
        // For local URLs, prefix with host
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
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        
        // Provide more specific error messages
        if (err.name === 'CastError') {
            console.log('ERROR: Invalid item ID format (CastError)');
            console.log('Problematic ID value:', req.params.id);
            return res.status(400).json({ 
                message: 'Invalid item ID format',
                details: `The provided ID "${req.params.id}" is not a valid MongoDB ObjectId`
            });
        }
        if (err.name === 'ValidationError') {
            console.log('ERROR: Validation error');
            return res.status(400).json({ 
                message: 'Validation error', 
                error: err.message,
                details: 'Check that all required fields are provided and in the correct format'
            });
        }
        if (err.code === 11000) {
            console.log('ERROR: Duplicate key error');
            return res.status(400).json({ 
                message: 'Duplicate item name in category',
                details: 'An item with this name already exists in the same category'
            });
        }
        
        // Generic error response
        console.log('ERROR: Generic internal server error');
        res.status(500).json({ 
            message: 'Failed to update item',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
            details: 'An unexpected error occurred while updating the item'
        });
    }
};