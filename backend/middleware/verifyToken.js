import { authMiddleware } from './auth.js';

// Export authMiddleware as verifyToken to match the expected import
export const verifyToken = authMiddleware;