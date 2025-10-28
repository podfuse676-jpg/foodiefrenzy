import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

// Log Cloudinary configuration to verify it's loaded
console.log('=== CLOUDINARY CONFIGURATION FROM CONFIG FILE ===');
console.log('Cloudinary config available:', !!cloudinary);
console.log('Cloudinary config:', cloudinary.config());

const itemRouter = express.Router();

// Configure Cloudinary storage
let storage;
try {
    // Verify Cloudinary is properly configured before creating storage
    const cloudConfig = cloudinary.config();
    console.log('=== CLOUDINARY CONFIG VERIFICATION ===');
    console.log('Cloudinary config before storage creation:', {
        cloud_name: cloudConfig.cloud_name,
        api_key: cloudConfig.api_key ? 'SET' : 'NOT SET',
        api_secret: cloudConfig.api_secret ? 'SET' : 'NOT SET'
    });
    
    if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
        throw new Error('Cloudinary not properly configured - missing required credentials');
    }
    
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
    
    console.log('Cloudinary storage configured successfully');
} catch (storageError) {
    console.error('=== CLOUDINARY STORAGE CONFIGURATION ERROR ===');
    console.error('Error configuring Cloudinary storage:', storageError);
    console.error('Error type:', storageError.constructor.name);
    console.error('Error message:', storageError.message);
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
    
    upload(req, res, (err) => {
        console.log('=== MULter UPLOAD RESULT ===');
        if (err) {
            console.log('Multer upload error:', err);
            console.log('Error type:', err.constructor.name);
            console.log('Error message:', err.message);
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

itemRouter.post('/', handleUpload, createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById); // Add this route
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', handleUpload, updateItem);

export default itemRouter;