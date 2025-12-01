import express from 'express';
import multer from 'multer';
// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Use local disk storage instead of Cloudinary
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

// Debug logging
console.log('itemRoute.js loaded');

// Configure local disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure uploads directory exists
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    }
});

// Add file filter to only accept images
const fileFilter = (req, file, cb) => {
    console.log('File filter checking file:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Even more robust wrapper function to handle multer errors properly
const handleUploadOptional = (req, res, next) => {
    // Check if this is a multipart/form-data request
    const contentType = req.headers['content-type'];
    const isMultipart = contentType && contentType.includes('multipart/form-data');
    
    console.log('=== HANDLE UPLOAD OPTIONAL ===');
    console.log('Content-Type:', contentType);
    console.log('Is multipart request:', isMultipart);
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request params:', req.params);
    
    // Always initialize req.body to ensure it exists
    if (!req.body) {
        console.log('Initializing empty body');
        req.body = {};
    }
    
    if (isMultipart) {
        // Only run multer for multipart requests
        upload(req, res, (err) => {
            if (err) {
                console.log('Multer error:', err.message);
                return res.status(400).json({ 
                    message: 'File upload failed',
                    error: err.message,
                    details: 'Please check that your file is a valid image (JPEG, PNG, WEBP, GIF) and under 5MB'
                });
            }
            console.log('Multer processed successfully');
            console.log('File in request:', req.file ? 'Yes' : 'No');
            console.log('Body after multer:', req.body);
            next();
        });
    } else {
        // No file upload, proceed to next middleware
        console.log('Skipping multer - not a multipart request');
        next();
    }
};

const itemRouter = express.Router();

// Add a simple test route to verify the router is working
itemRouter.get('/debug-test', (req, res) => {
    console.log('DEBUG TEST ROUTE HIT');
    res.json({ message: 'Item routes are working', timestamp: new Date().toISOString() });
});

itemRouter.post('/', handleUploadOptional, createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById);
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', handleUploadOptional, updateItem);

export default itemRouter;