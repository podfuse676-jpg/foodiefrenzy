import express from 'express';
import multer from 'multer';
// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Use local disk storage instead of Cloudinary
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

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
    // Check if the file has a mimetype and if it starts with 'image/'
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
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
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ 
                message: 'File upload failed',
                error: err.message,
                details: 'Please check that your file is a valid image (JPEG, PNG, WEBP, GIF) and under 5MB'
            });
        }
        next();
    });
};

const itemRouter = express.Router();

itemRouter.post('/', handleUpload, createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById);
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', handleUpload, updateItem);

export default itemRouter;