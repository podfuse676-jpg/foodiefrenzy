import axios from 'axios';

/**
 * Checks if an image URL is accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} - True if the image is accessible, false otherwise
 */
export const isImageUrlAccessible = async (url) => {
    try {
        // For relative URLs, we can't check accessibility, so we assume they're OK
        if (!url.startsWith('http')) {
            return true;
        }
        
        // For absolute URLs, check if they're accessible
        const response = await axios.head(url, { timeout: 5000 });
        return response.status === 200;
    } catch (error) {
        console.log(`Image URL ${url} is not accessible:`, error.message);
        return false;
    }
};

/**
 * Fixes broken image URLs by replacing them with a placeholder
 * @param {Object} item - The item object to fix
 * @returns {Object} - The item with fixed image URL
 */
export const fixBrokenImageUrl = (item) => {
    // If imageUrl is missing or broken, replace with a placeholder
    if (!item.imageUrl) {
        // Use a placeholder SVG as base64 encoded data URL
        item.imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
    }
    
    return item;
};

/**
 * Validates and fixes image URLs for a list of items
 * @param {Array} items - Array of item objects
 * @returns {Promise<Array>} - Array of items with validated image URLs
 */
export const validateAndFixImageUrls = async (items) => {
    // For now, we'll just use the simple fix without making HTTP requests
    // to avoid performance issues
    return items.map(item => fixBrokenImageUrl(item));
};

export default {
    isImageUrlAccessible,
    fixBrokenImageUrl,
    validateAndFixImageUrls
};