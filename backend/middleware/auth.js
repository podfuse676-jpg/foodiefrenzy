import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token =
        req.cookies?.token ||
        (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded contains { id, email, username, role }
        // Ensure consistency with both id and _id
        req.user = { 
            _id: decoded.id, 
            id: decoded.id,
            email: decoded.email, 
            username: decoded.username,
            role: decoded.role
        };
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Token expired'
                : 'Invalid token';
        res.status(403).json({ success: false, message });
    }
};

// Admin middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admin rights required.' });
    }
    next();
};

export { authMiddleware, adminMiddleware };