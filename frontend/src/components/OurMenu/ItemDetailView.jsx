import React, { useState, useEffect } from 'react';
import { FaTimes, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';
import FlavorSelection from './FlavorSelection';
// Import review components
import ReviewStats from '../Review/ReviewStats';
import ReviewList from '../Review/ReviewList';
import ReviewForm from '../Review/ReviewForm';
import apiClient from '../../utils/apiClient';

const ItemDetailView = ({ item, onClose, onAddToCart }) => {
  const cartContext = useCart();
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  // Order states
  const [userOrders, setUserOrders] = useState([]);
  const [orderId, setOrderId] = useState('');

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
    
    // Initialize flavors if available
    if (item.flavourOptions && item.flavourOptions.length > 0) {
      // For single flavor selection, we might want to select the first one by default
      // But for now, we'll leave it empty and let the user select
    }
    
    // Fetch user orders to get order ID for reviews
    fetchUserOrders();
  }, [item]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await apiClient.get('/api/orders');
      setUserOrders(response.data);
      
      // Find the first order that contains this item
      const orderWithItem = response.data.find(order => 
        order.items && order.items.some(orderItem => 
          (orderItem.item._id && orderItem.item._id === (item._id || item.id)) ||
          (orderItem.item.id && orderItem.item.id === (item._id || item.id)) ||
          (orderItem.item.name && orderItem.item.name === item.name)
        )
      );
      
      if (orderWithItem) {
        setOrderId(orderWithItem._id || orderWithItem.id);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleModifierChange = (modifierGroup, option) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [modifierGroup]: option
    }));
  };

  const handleFlavorChange = (flavors) => {
    setSelectedFlavors(flavors);
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
    setIsAddingToCart(true);
    
    const itemToAdd = {
      ...item,
      quantity,
      modifiers: selectedModifiers,
      flavors: selectedFlavors,
      totalPrice: calculateTotalPrice(),
      variant: selectedVariant
    };

    if (onAddToCart) {
      onAddToCart(item, quantity, selectedVariant, selectedFlavors);
    } else if (cartContext && typeof cartContext.addToCart === 'function') {
      cartContext.addToCart(item, quantity, selectedVariant, selectedFlavors);
    }
    
    // Add a small delay for animation before closing
    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
    }, 500);
  };

  const getImageUrl = (url) => {
    if (!url) return '/placeholder-image.jpg';
    return url.includes('?') ? `${url}&size=large` : `${url}?size=large`;
  };

  // Check if item has customization options
  const hasCustomizationOptions = (item.variants && item.variants.length > 0) || 
                                 (item.modifierGroups && item.modifierGroups.length > 0) ||
                                 (item.flavourOptions && item.flavourOptions.length > 0);

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await apiClient.post('/api/reviews', {
        ...reviewData,
        orderId: orderId || reviewData.orderId
      });
      console.log('Review submitted:', response.data);
      setReviewSubmitted(true);
      setShowReviewForm(false);
      // You might want to refresh the reviews here
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // Check if user has purchased this item
  const hasPurchasedItem = userOrders.some(order => 
    order.items && order.items.some(orderItem => 
      (orderItem.item._id && orderItem.item._id === (item._id || item.id)) ||
      (orderItem.item.id && orderItem.item.id === (item._id || item.id)) ||
      (orderItem.item.name && orderItem.item.name === item.name)
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-pop-in">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-[#8BC34A]/20 flex justify-between items-center z-10">
          <h2 className="text-2xl font-dancingscript text-gray-800">{item.name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-[#8BC34A] transition-colors p-2 rounded-full hover:bg-[#8BC34A]/10"
            aria-label="Close item detail"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Image */}
            <div className="md:w-2/5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
                <img 
                  src={getImageUrl(item.imageUrl || item.image)} 
                  alt={item.name} 
                  className="w-full h-80 object-contain bg-[#F9FFF6]"
                />
              </div>
            </div>
            
            {/* Right Column - Details and Options */}
            <div className="md:w-3/5">
              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 font-cinzel leading-relaxed">
                  {item.description || 'No detailed description available for this product.'}
                </p>
              </div>
              
              {/* Price Information */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#8BC34A]/20 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-cinzel text-gray-800">Base Price:</span>
                  <span className="font-dancingscript text-gray-800">
                    ${Number(item.price || 0).toFixed(2)} CAD
                  </span>
                </div>
                
                {item.taxRate && item.taxRate > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="font-cinzel text-gray-800">Tax ({item.taxRate}%):</span>
                    <span className="font-dancingscript text-gray-800">
                      ${(item.price * item.taxRate / 100).toFixed(2)} CAD
                    </span>
                  </div>
                )}
                
                {item.gst && item.gst > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="font-cinzel text-gray-800">GST ({item.gst}%):</span>
                    <span className="font-dancingscript text-gray-800">
                      ${(item.price * item.gst / 100).toFixed(2)} CAD
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between mt-3 pt-3 border-t border-[#8BC34A]/20">
                  <span className="font-cinzel text-gray-800 font-bold">Total:</span>
                  <span className="font-dancingscript text-gray-800 text-xl">
                    ${calculateTotalPrice().toFixed(2)} CAD
                  </span>
                </div>
              </div>
              
              {/* Flavor Selection */}
              {item.flavourOptions && item.flavourOptions.length > 0 && (
                <FlavorSelection
                  flavors={item.flavourOptions}
                  selectedFlavors={selectedFlavors}
                  onFlavorChange={handleFlavorChange}
                  multipleSelection={true}
                  title="Flavor Options"
                />
              )}
              
              {/* Variants (Sizes) */}
              {item.variants && item.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-dancingscript text-xl text-gray-800 mb-3">Size Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map((variant, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 border-2 rounded-full font-cinzel transition-all transform hover:scale-105 ${
                          selectedVariant === variant 
                            ? 'border-[#8BC34A] bg-[#8BC34A]/10 text-gray-800 shadow-sm' 
                            : 'border-gray-800/20 text-gray-800 hover:border-[#8BC34A]/50 hover:bg-[#8BC34A]/5'
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
                <div className="mb-6">
                  {item.modifierGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4">
                      <h3 className="font-dancingscript text-xl text-gray-800 mb-3">{group.name}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {group.options && group.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            className={`px-3 py-2 border-2 rounded-lg font-cinzel transition-all text-left transform hover:scale-105 ${
                              selectedModifiers[group.name] === option 
                                ? 'border-[#8BC34A] bg-[#8BC34A]/10 text-gray-800 shadow-sm' 
                                : 'border-gray-800/20 text-gray-800 hover:border-[#8BC34A]/50 hover:bg-[#8BC34A]/5'
                            }`}
                            onClick={() => handleModifierChange(group.name, option)}
                          >
                            <div className="font-medium text-sm">{option.name || option}</div>
                            {option.price && option.price > 0 && (
                              <div className="text-[#8BC34A] text-xs">+${option.price.toFixed(2)}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#F9FFF6] to-[#FFFFFF] rounded-2xl border border-[#8BC34A]/20 shadow-sm">
                  <p className="text-gray-800 font-cinzel italic">
                    No flavours or customization options available for this item.
                  </p>
                </div>
              )}
              
              {/* Quantity and Add to Cart */}
              <div className="mt-8 pt-6 border-t border-[#8BC34A]/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center border-2 border-[#8BC34A] rounded-xl shadow-sm">
                    <button 
                      className="px-5 py-3 text-gray-800 hover:bg-[#8BC34A]/10 transition-colors rounded-l-xl"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span className="px-6 py-3 text-gray-800 font-cinzel font-medium text-lg">{quantity}</span>
                    <button 
                      className="px-5 py-3 text-gray-800 hover:bg-[#8BC34A]/10 transition-colors rounded-r-xl"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="text-2xl font-dancingscript text-gray-800">
                    Total: ${calculateTotalPrice().toFixed(2)} CAD
                  </div>
                </div>
                
                <button 
                  className={`w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white py-4 rounded-2xl flex items-center justify-center font-cinzel text-lg transition-all transform hover:scale-[1.02] shadow-xl ${
                    isAddingToCart ? 'scale-105' : ''
                  }`}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <FaShoppingCart className={`mr-3 ${isAddingToCart ? 'animate-bounce' : ''}`} /> 
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
              
              {/* Reviews Section */}
              <div className="mt-8 pt-6 border-t border-[#8BC34A]/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-dancingscript text-gray-800">
                    Customer Reviews
                  </h3>
                  {hasPurchasedItem && (
                    <button 
                      onClick={() => setShowReviewForm(true)}
                      className="bg-[#8BC34A]/20 text-[#8BC34A] px-4 py-2 rounded-full font-cinzel hover:bg-[#8BC34A]/30 transition-colors"
                    >
                      Write a Review
                    </button>
                  )}
                </div>
                
                {/* Review Statistics */}
                <div className="mb-6">
                  <ReviewStats itemId={item._id || item.id} apiClient={apiClient} />
                </div>
                
                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm 
                      item={item} 
                      orderId={orderId}
                      onSubmit={handleReviewSubmit}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}
                
                {/* Success Message */}
                {reviewSubmitted && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                    <p className="font-cinzel">Thank you for your review!</p>
                  </div>
                )}
                
                {/* Reviews List */}
                <ReviewList itemId={item._id || item.id} apiClient={apiClient} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;