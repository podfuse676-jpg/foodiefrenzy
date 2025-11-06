import express from 'express';
import multer from 'multer';
// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Use direct Cloudinary import for more control
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

// Configure Cloudinary explicitly with environment variables
console.log('=== CONFIGURING CLOUDINARY DIRECTLY ===');
console.log('Environment variables:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '[SET]' : '[NOT SET]'
});

// Configure Cloudinary with explicit credentials
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if all required credentials are present
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
    console.error('=== CLOUDINARY CONFIGURATION ERROR ===');
    console.error('Missing required Cloudinary credentials:', {
        cloud_name: cloudinaryConfig.cloud_name ? 'SET' : 'MISSING',
        api_key: cloudinaryConfig.api_key ? 'SET' : 'MISSING',
        api_secret: cloudinaryConfig.api_secret ? 'SET' : 'MISSING'
    });
}

// Apply the configuration
cloudinary.config(cloudinaryConfig);

// Verify the configuration was applied
const appliedConfig = cloudinary.config();
console.log('Applied Cloudinary configuration:', {
    cloud_name: appliedConfig.cloud_name,
    api_key: appliedConfig.api_key ? 'SET' : 'NOT SET',
    api_secret: appliedConfig.api_secret ? 'SET' : 'NOT SET'
});

const itemRouter = express.Router();

// Configure Cloudinary storage
let storage;
try {
    console.log('=== CREATING CLOUDINARY STORAGE ===');
    
    // Verify Cloudinary is properly configured before creating storage
    const cloudConfig = cloudinary.config();
    console.log('Cloudinary config before storage creation:', {
        cloud_name: cloudConfig.cloud_name,
        api_key: cloudConfig.api_key ? 'SET' : 'NOT SET',
        api_secret: cloudConfig.api_secret ? 'SET' : 'NOT SET'
    });
    
    if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
        throw new Error('Cloudinary not properly configured - missing required credentials');
    }
    
    console.log('Creating CloudinaryStorage with cloudinary instance:', !!cloudinary);
    
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'foodiefrenzy_items',
            format: async (req, file) => {
                // Determine format based on file mimetype
                console.log('Determining format for file:', file.originalname, file.mimetype);
                if (file.mimetype.includes('webp')) return 'webp';
                if (file.mimetype.includes('png')) return 'png';
                if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg')) return 'jpg';
                return 'jpg'; // default
            },
            public_id: (req, file) => {
                // Generate unique public ID
                const timestamp = Date.now();
                // Sanitize filename to remove special characters and spaces
                const originalname = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
                const publicId = `${originalname}_${timestamp}`;
                console.log('Original filename:', file.originalname);
                console.log('Sanitized public_id:', publicId);
                return publicId;
            },
        },
    });
    
    console.log('Cloudinary storage created successfully');
} catch (storageError) {
    console.error('=== CLOUDINARY STORAGE CREATION ERROR ===');
    console.error('Error creating Cloudinary storage:', storageError);
    console.error('Error type:', storageError.constructor.name);
    console.error('Error message:', storageError.message);
    console.error('Error stack:', storageError.stack);
    
    // Fallback to disk storage if Cloudinary fails
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/images/')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
        }
    });
    console.log('Using disk storage as fallback');
}

// Add file filter to only accept images
const fileFilter = (req, file, cb) => {
    console.log('=== FILE FILTER DEBUG INFO ===');
    console.log('File originalname:', file.originalname);
    console.log('File mimetype:', file.mimetype);
    console.log('File fieldname:', file.fieldname);
    console.log('File encoding:', file.encoding);
    
    // Check if the file has a mimetype and if it starts with 'image/'
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        console.log('File accepted as valid image');
        cb(null, true);
    } else {
        console.log('File rejected - not a valid image type');
        cb(new Error(`Invalid file type: ${file.mimetype || 'unknown'}. Only image files are allowed.`), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Wrapper function to handle multer errors properly
const handleUpload = (req, res, next) => {
    console.log('=== HANDLE UPLOAD START ===');
    console.log('Request content-type:', req.headers['content-type']);
    console.log('Request method:', req.method);
    console.log('Request url:', req.url);
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);
    
    // Verify storage is configured
    console.log('Storage configured:', !!storage);
    
    // Check if this is a PUT request to update an item
    if (req.method === 'PUT' && req.params.id) {
        console.log('=== ITEM UPDATE REQUEST ===');
        console.log('Item ID from params:', req.params.id);
        console.log('Item ID length:', req.params.id ? req.params.id.length : 0);
        console.log('Item ID format valid:', /^[0-9a-fA-F]{24}$/.test(req.params.id));
    }
    
    upload(req, res, (err) => {
        console.log('=== MULter UPLOAD RESULT ===');
        if (err) {
            console.log('Multer upload error:', err);
            console.log('Error type:', err.constructor.name);
            console.log('Error message:', err.message);
            // Add more detailed error information
            if (err.message && err.message.includes('api_key')) {
                console.log('=== CLOUDINARY API KEY ERROR DETECTED ===');
                console.log('This suggests Cloudinary is not properly configured');
                console.log('Current Cloudinary config:', cloudinary.config());
            }
            return res.status(400).json({ 
                message: 'File upload failed',
                error: err.message,
                details: 'Please check that your file is a valid image (JPEG, PNG, WEBP, GIF) and under 5MB'
            });
        }
        
        console.log('Upload successful');
        console.log('File in request:', req.file);
        console.log('Body in request:', req.body);
        next();
    });
};

// Add a middleware to log all request details
const logRequestDetails = (req, res, next) => {
    console.log('=== REQUEST DETAILS ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);
    console.log('Body exists:', !!req.body);
    console.log('File exists:', !!req.file);
    
    // Detailed parameter logging
    if (req.params && req.params.id) {
        console.log('=== DETAILED PARAM LOGGING ===');
        console.log('Param ID:', req.params.id);
        console.log('Param ID type:', typeof req.params.id);
        console.log('Param ID length:', req.params.id.length);
        console.log('Param ID char codes:', [...req.params.id].map(c => c.charCodeAt(0)));
    }
    
    next();
};

// Apply the logging middleware to all item routes
itemRouter.use(logRequestDetails);

// Add a debug route to test item ID handling
itemRouter.put('/debug/:id', (req, res) => {
    console.log('=== DEBUG ITEM ID ===');
    console.log('Request params:', req.params);
    console.log('Item ID from params:', req.params.id);
    console.log('Item ID length:', req.params.id ? req.params.id.length : 0);
    console.log('Item ID is valid ObjectId:', /^[0-9a-fA-F]{24}$/.test(req.params.id));
    
    res.json({
        message: 'ID debug info',
        params: req.params,
        id: req.params.id,
        length: req.params.id ? req.params.id.length : 0,
        isValidFormat: /^[0-9a-fA-F]{24}$/.test(req.params.id)
    });
});

itemRouter.post('/', handleUpload, createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById); // Add this route
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', handleUpload, updateItem);

// Add a specific route for testing the exact ID that's failing
itemRouter.put('/68fe1ec19090329489752b18', (req, res) => {
    console.log('=== SPECIAL DEBUG ROUTE FOR PROBLEMATIC ID ===');
    console.log('This route was hit for the specific ID that was failing');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Forward to the regular updateItem handler
    return updateItem(req, res);
});

// Add a route for the new problematic ID
itemRouter.put('/68fe1ec29090329489752b1b', (req, res) => {
    console.log('=== SPECIAL DEBUG ROUTE FOR NEW PROBLEMATIC ID ===');
    console.log('This route was hit for the new specific ID that is failing');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request headers:', req.headers);
    
    // Forward to the regular updateItem handler
    return updateItem(req, res);
});

// Add a route to test parameter parsing
itemRouter.put('/test-param/:id', (req, res) => {
    console.log('=== TEST PARAM ROUTE ===');
    console.log('Request params:', req.params);
    console.log('ID param:', req.params.id);
    console.log('ID param type:', typeof req.params.id);
    console.log('ID param length:', req.params.id.length);
    
    // Test the ID validation
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    const isValid = objectIdRegex.test(req.params.id);
    console.log('ID is valid:', isValid);
    
    res.json({
        message: 'Param test',
        params: req.params,
        id: req.params.id,
        isValid: isValid
    });
});

export default itemRouter;