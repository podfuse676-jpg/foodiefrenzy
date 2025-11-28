import React, { useState } from 'react';
import { FaPlus, FaMinus, FaStar } from 'react-icons/fa';

const MenuItem = ({ item, cartEntry, quantity, addToCart, updateQuantity, removeFromCart, onOpenDetail }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // EASY IMAGE CUSTOMIZATION:
  // To add your own photos to menu items, simply add them below in this format:
  // 'Item Name': 'Direct Image URL'
  // Example:
  // 'Cappuccino': 'https://example.com/cappuccino.jpg',
  // 'Green Tea': 'https://example.com/green-tea.jpg',
  // 'Sandwich': 'https://example.com/sandwich.jpg'
  const customImageMap = {
    // Add your menu item photos here:
    // 'Cappuccino': 'https://example.com/cappuccino.jpg',
    // 'Green Tea': 'https://example.com/green-tea.jpg',
    // 'Sandwich': 'https://example.com/sandwich.jpg'
    // Special offers examples:
    'Special Offer 1': 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670243/foodiefrenzy_items/foodiefrenzy_items/Dashboard_Polish_1761670242267.webp',
    'Special Offer 2': 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670308/foodiefrenzy_items/foodiefrenzy_items/Car_Perfume_1761670306659.webp'
  };

  // Generate image URL
  const getImageUrl = () => {
    // Check if there's a custom image for this specific item
    if (customImageMap[item.name]) {
      console.log('Using custom image for:', item.name);
      return customImageMap[item.name];
    }
    
    // Check if item has a specific image URL
    if (item.imageUrl || item.image) {
      // Ensure we're using the full URL for Cloudinary images
      const imageUrl = item.imageUrl || item.image;
      console.log('Using item image URL:', imageUrl);
      
      // If it's a local path (starts with /uploads), construct full URL
      if (imageUrl.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://lakeshore-convenience.onrender.com';
        return `${baseUrl}${imageUrl}`;
      }
      
      // If it's already a full URL (Cloudinary), check if we have a local version
      if (imageUrl.startsWith('http')) {
        // Check if this item might have a local image
        // This is a temporary fix to prefer local images over Cloudinary
        const itemNameClean = item.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const possibleLocalPath = `/uploads/images/${item.name}.webp`;
        const possibleLocalPathClean = `/uploads/images/${itemNameClean}.webp`;
        
        // We'll continue to use the provided URL for now, but the backend should update the database
        return imageUrl;
      }
      
      // For any other relative path, construct full URL
      const baseUrl = import.meta.env.VITE_API_URL || 'https://lakeshore-convenience.onrender.com';
      return `${baseUrl}${imageUrl}`;
    }
    
    // Generate image based on item name
    const keywords = item.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').join(',');
    const fallbackUrl = `https://source.unsplash.com/200x200/?${keywords},grocery`;
    console.log('Using fallback image for:', item.name, 'URL:', fallbackUrl);
    return fallbackUrl;
  };
  
  const imageUrl = getImageUrl();
  
  // State for image loading status
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle adding to cart
  const handleAddToCart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    addToCart(item, 1);
  };
  
  // Check if item has customization options
  const hasCustomizationOptions = (item.variants && item.variants.length > 0) || 
                                 (item.modifierGroups && item.modifierGroups.length > 0) ||
                                 (item.flavourOptions && item.flavourOptions.length > 0) ||
                                 (item.customizations && item.customizations.length > 0);
  
  // Calculate tax and GST
  const taxAmount = item.taxRate ? (item.price * item.taxRate / 100) : 0;
  const gstAmount = item.gst ? (item.price * item.gst / 100) : 0;
  const totalPrice = Number(item.price) + taxAmount + gstAmount;
  
  // Get rating information (support both new and legacy fields)
  const averageRating = item.averageRating || item.rating || 0;
  const totalReviews = item.totalReviews || item.total || 0;

  return (
    // Updated to light fresh colors with improved mobile responsiveness
    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-[#8BC34A]/30 backdrop-blur-sm flex flex-col items-center gap-3 transition-all duration-300 hover:border-[#8BC34A] hover:shadow-xl hover:shadow-[#8BC34A]/10 transform hover:-translate-y-1 p-4 group card-hover">
      {/* Image Container - improved for mobile with lazy loading */}
      <div className="w-full h-32 flex-shrink-0 relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        {imageUrl && !imageLoadError ? (
          <img
            src={imageUrl}
            alt={item.name}
            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy" // Add lazy loading
            onError={(e) => {
              console.error('Image failed to load:', imageUrl, 'Item:', item.name);
              setImageLoadError(true);
              // Fallback to a default image if the image fails to load
              e.target.src = 'https://source.unsplash.com/200x200/?grocery,item';
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', imageUrl, 'Item:', item.name);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#8BC34A]/10 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              <span className="text-[#8BC34A] text-xs text-center px-1 mt-2 block">
                {imageLoadError ? 'Image unavailable' : 'Loading image...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Item Details - improved for mobile */}
      <div className="w-full text-center flex flex-col flex-grow">
        <h3 className="text-lg font-dancingscript text-gray-800 mb-1 line-clamp-2 sm:line-clamp-1">
          {item.name}
        </h3>
        
        {/* Rating Display */}
        {averageRating > 0 && (
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'} text-xs icon-smooth`} 
                />
              ))}
            </div>
            <span className="text-gray-800 text-xs font-cinzel">
              {averageRating.toFixed(1)} ({totalReviews})
            </span>
          </div>
        )}
        
        {/* Price Information - improved for mobile */}
        <div className="mt-2 text-left w-full">
          <p className="text-gray-800 font-cinzel font-bold text-base sm:text-lg">
            ${Number(item.price).toFixed(2)} CAD
          </p>
          {(taxAmount > 0 || gstAmount > 0) && (
            <div className="flex flex-col sm:flex-row justify-between text-gray-800/80 text-xs font-cinzel mt-1 gap-1">
              {taxAmount > 0 && (
                <span>Tax: ${taxAmount.toFixed(2)}</span>
              )}
              {gstAmount > 0 && (
                <span>GST: ${gstAmount.toFixed(2)}</span>
              )}
            </div>
          )}
          <p className="text-gray-800 font-cinzel font-bold text-sm mt-1">
            Total: ${totalPrice.toFixed(2)} CAD
          </p>
        </div>
        
        {/* Message about customization in detail view */}
        {hasCustomizationOptions && (
          <p className="text-gray-800/70 text-xs font-cinzel mt-2 line-clamp-2">
            Options available in detail view
          </p>
        )}
      </div>

      {/* Add to Cart Controls - improved for mobile */}
      <div className="flex items-center gap-2 mt-2 w-full justify-center">
        {quantity > 0 ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                quantity > 1
                  ? updateQuantity(cartEntry._id, quantity - 1)
                  : removeFromCart(cartEntry._id);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8BC34A]/40 flex items-center justify-center hover:bg-[#8BC34A]/50 transition duration-200 active:scale-95 shadow-sm quantity-counter btn-press-feedback"
              aria-label="Decrease quantity"
            >
              <FaMinus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
            <span className="w-8 sm:w-10 text-center text-gray-800 font-cinzel text-sm sm:text-base font-bold">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(cartEntry._id, quantity + 1);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8BC34A]/40 flex items-center justify-center hover:bg-[#8BC34A]/50 transition duration-200 active:scale-95 shadow-sm quantity-counter btn-press-feedback"
              aria-label="Increase quantity"
            >
              <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              hasCustomizationOptions && onOpenDetail
                ? onOpenDetail()
                : handleAddToCart();
            }}
            className={`bg-gradient-to-r from-[#8BC34A] to-[#7CB342] border-2 border-[#8BC34A] px-3 py-1 sm:px-4 sm:py-1 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:from-[#7CB342] hover:to-[#8BC34A] flex items-center gap-1 active:scale-95 shadow-md hover:shadow-lg transform btn-subtle-hover ${isAnimating ? "scale-110" : ""}`}
            aria-label={`Add ${item.name} to cart`}
          >
            <FaPlus className="w-2 h-2 icon-smooth" />
            <span className="truncate max-w-[60px] sm:max-w-none">
              {hasCustomizationOptions ? "Customize" : "Add"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;