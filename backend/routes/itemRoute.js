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
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    console.log('=== MULter ERROR HANDLING ===');
    console.log('Error type:', err.constructor.name);
    console.log('Error message:', err.message);
    console.log('Error code:', err.code);
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);
    
    if (err instanceof multer.MulterError) {
        console.log('Multer error details:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                message: 'File too large. Maximum file size is 5MB.',
                error: err.message,
                code: err.code
            });
        }
        return res.status(400).json({ 
            message: 'File upload error: ' + err.message,
            error: err.message,
            code: err.code
        });
    } else if (err) {
        console.log('File filter error:', err.message);
        return res.status(400).json({ 
            message: 'Invalid file type. Only image files are allowed.',
            error: err.message,
            details: err.message.includes('unknown') ? 'The file type could not be determined. Please ensure you are uploading a valid image file (JPEG, PNG, WEBP, GIF).' : err.message
        });
    }
    next();
};

itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById); // Add this route
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', upload.single('image'), handleMulterError, updateItem);

export default itemRouter;