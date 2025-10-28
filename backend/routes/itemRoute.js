import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

const itemRouter = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'foodiefrenzy_items',
        format: async (req, file) => {
            // Determine format based on file mimetype
            if (file.mimetype.includes('webp')) return 'webp';
            if (file.mimetype.includes('png')) return 'png';
            if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg')) return 'jpg';
            return 'jpg'; // default
        },
        public_id: (req, file) => {
            // Generate unique public ID
            const timestamp = Date.now();
            const originalname = file.originalname.split('.')[0];
            return `${originalname}_${timestamp}`;
        },
    },
});

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