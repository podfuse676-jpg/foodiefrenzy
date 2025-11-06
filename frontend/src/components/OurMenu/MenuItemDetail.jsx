import React, { useState, useEffect } from 'react';
import { FaTimes, FaMinus, FaPlus, FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';

const MenuItemDetail = ({ item, onClose, addToCart }) => {
  const cartContext = useCart();
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    if (!item) return;
    
    // Set default variant if available
    if (item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    }
    
    // Initialize modifiers if available
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      const initialModifiers = {};
      item.modifierGroups.forEach(group => {
        if (group.options && group.options.length > 0) {
          // Select first option by default
          initialModifiers[group.name] = group.options[0];
        }
      });
      setSelectedModifiers(initialModifiers);
    }
  }, [item]);

  const handleModifierChange = (modifierGroup, option) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [modifierGroup]: option
    }));
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = selectedVariant ? selectedVariant.price : Number(item.price || 0);
    
    // Add modifier prices
    let modifiersPrice = 0;
    Object.values(selectedModifiers).forEach(modifier => {
      if (modifier && modifier.price) {
        modifiersPrice += modifier.price;
      }
    });
    
    return (basePrice + modifiersPrice) * quantity;
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...item,
      quantity,
      modifiers: selectedModifiers,
      totalPrice: calculateTotalPrice(),
      variant: selectedVariant
    };

    if (typeof addToCart === 'function') {
      addToCart(itemToAdd);
    } else if (cartContext && typeof cartContext.addToCart === 'function') {
      cartContext.addToCart(itemToAdd);
    }
    
    // Show confirmation
    setShowAddedToCart(true);
    setTimeout(() => {
      setShowAddedToCart(false);
      onClose();
    }, 1500);
  };

  const getImageUrl = (url) => {
    if (!url) return '/placeholder-image.jpg';
    return url.includes('?') ? `${url}&size=large` : `${url}?size=large`;
  };

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-[#F4D03F]" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#F4D03F]" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-[#F4D03F]" />);
    }
    
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-[#4CAF50]/20 flex justify-between items-center z-10">
          <h2 className="text-2xl font-dancingscript text-[#333333]">{item.name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-[#4CAF50] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 md:flex">
          {/* Left Column - Images */}
          <div className="md:w-2/5 p-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={getImageUrl(item.image)} 
                alt={item.name} 
                className="w-full h-80 object-contain bg-[#F9FFF6]"
              />
              <div className="absolute top-4 right-4 bg-[#4CAF50] text-white px-3 py-1 rounded-full font-cinzel text-sm shadow-lg">
                ${selectedVariant ? selectedVariant.price?.toFixed(2) : Number(item.price || 0).toFixed(2)} CAD
              </div>
            </div>
            
            {/* Rating and Reviews Preview */}
            <div className="mt-4 p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex">
                    {renderRating(item.rating || 4.5)}
                  </div>
                  <span className="ml-2 text-[#333333] font-cinzel font-medium">
                    {item.rating || 4.5} <span className="text-[#333333]/70">({item.reviewsCount || 127} reviews)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Details and Options */}
          <div className="md:w-3/5 p-2">
            {/* Tabs */}
            <div className="flex border-b border-[#4CAF50]/20 mb-6">
              <button 
                className={`px-4 py-2 font-cinzel font-medium ${activeTab === 'details' ? 'border-b-2 border-[#4CAF50] text-[#4CAF50]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`px-4 py-2 font-cinzel font-medium ${activeTab === 'flavors' ? 'border-b-2 border-[#4CAF50] text-[#4CAF50]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('flavors')}
              >
                Flavors
              </button>
              <button 
                className={`px-4 py-2 font-cinzel font-medium ${activeTab === 'reviews' ? 'border-b-2 border-[#4CAF50] text-[#4CAF50]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'details' && (
                <div>
                  <p className="text-gray-700 mb-6 font-cinzel leading-relaxed">
                    {item.description || 'No detailed description available for this product.'}
                  </p>
                  
                  {/* Variants (Sizes) */}
                  {item.variants && item.variants.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-dancingscript text-xl text-[#333333] mb-3">Size Options</h3>
                      <div className="flex flex-wrap gap-3">
                        {item.variants.map((variant, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border-2 rounded-full font-cinzel transition-all ${
                              selectedVariant === variant 
                                ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#333333]' 
                                : 'border-[#333333]/20 text-[#333333] hover:border-[#4CAF50]/50 hover:bg-[#4CAF50]/5'
                            }`}
                            onClick={() => handleVariantChange(variant)}
                          >
                            {variant.name} - ${variant.price?.toFixed(2)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Modifier Groups (Flavors, Extras, etc.) */}
                  {item.modifierGroups && item.modifierGroups.length > 0 ? (
                    item.modifierGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="mb-6">
                        <h3 className="font-dancingscript text-xl text-[#333333] mb-3">{group.name}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {group.options && group.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              className={`px-4 py-3 border-2 rounded-xl font-cinzel transition-all text-left ${
                                selectedModifiers[group.name] === option 
                                  ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#333333]' 
                                  : 'border-[#333333]/20 text-[#333333] hover:border-[#4CAF50]/50 hover:bg-[#4CAF50]/5'
                              }`}
                              onClick={() => handleModifierChange(group.name, option)}
                            >
                              <div className="font-medium">{option.name || option}</div>
                              {option.price && option.price > 0 && (
                                <div className="text-[#4CAF50] text-sm">+${option.price.toFixed(2)}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20">
                      <p className="text-[#333333] font-cinzel italic">
                        This item has no additional customization options.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'flavors' && (
                <div>
                  <h3 className="font-dancingscript text-xl text-[#333333] mb-4">Flavor Options</h3>
                  {item.flavors && item.flavors.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {item.flavors.map((flavor, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20 text-center">
                          <span className="font-cinzel text-[#333333]">{flavor}</span>
                        </div>
                      ))}
                    </div>
                  ) : item.modifierGroups && item.modifierGroups.some(group => 
                      group.name.toLowerCase().includes('flavor') || 
                      group.name.toLowerCase().includes('sweet') ||
                      group.name.toLowerCase().includes('creamer') ||
                      group.name.toLowerCase().includes('sugar')) ? (
                    <div className="p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20">
                      <p className="text-[#333333] font-cinzel">
                        Flavor options are available in the customization section above.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20 text-center">
                      <p className="text-[#333333] font-cinzel">
                        This item has no specific flavor options.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-dancingscript text-xl text-[#333333] mb-4">Customer Reviews</h3>
                  {item.reviews && item.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {item.reviews.slice(0, 3).map((review, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-cinzel font-medium text-[#333333]">{review.user}</span>
                            <div className="flex">
                              {renderRating(review.rating)}
                            </div>
                          </div>
                          <p className="text-[#333333] font-cinzel text-sm">{review.comment}</p>
                          <p className="text-[#333333]/70 text-xs mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#4CAF50]/20 text-center">
                      <p className="text-[#333333] font-cinzel">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Add to Cart Section */}
            <div className="mt-8 pt-6 border-t border-[#4CAF50]/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center border-2 border-[#4CAF50] rounded-xl">
                  <button 
                    className="px-5 py-3 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-l-xl"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-6 py-3 text-[#333333] font-cinzel font-medium text-lg">{quantity}</span>
                  <button 
                    className="px-5 py-3 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-r-xl"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="text-2xl font-dancingscript text-[#333333]">
                  Total: ${calculateTotalPrice().toFixed(2)} CAD
                </div>
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#4CAF50] text-white py-4 rounded-2xl flex items-center justify-center font-cinzel text-lg transition-all transform hover:scale-[1.02] shadow-xl"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="mr-3" /> Add to Cart
              </button>
              
              {/* Added to Cart Confirmation */}
              {showAddedToCart && (
                <div className="fixed top-4 right-4 bg-[#4CAF50] text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fadeInOut flex items-center">
                  <FaShoppingCart className="mr-2" />
                  <span className="font-cinzel">Added to Cart!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;