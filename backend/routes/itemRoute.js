import express from 'express';
import multer from 'multer';
import { createItem, getItems, deleteItem, updateItem, getItemById } from '../controllers/itemController.js';

const itemRouter = express.Router();

// Configure multer with error handling
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        console.log('Setting destination for file upload');
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        console.log('Setting filename for file upload:', file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Add file filter to only accept images
const fileFilter = (_req, file, cb) => {
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
});

// Error handling middleware for multer
const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log('Multer error:', err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum file size is 5MB.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
        console.log('File filter error:', err.message);
        return res.status(400).json({ message: 'Invalid file type. Only image files are allowed.' });
    }
    next();
};

itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById); // Add this route
itemRouter.delete('/:id', deleteItem);
itemRouter.put('/:id', upload.single('image'), handleMulterError, updateItem);

export default itemRouter;