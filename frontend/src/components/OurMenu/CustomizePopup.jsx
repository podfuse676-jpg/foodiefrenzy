import React, { useState, useEffect } from 'react';
import { FaTimes, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';

const CustomizePopup = ({ item, onClose, onAddToCart }) => {
  const cartContext = useCart();
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

    if (typeof onAddToCart === 'function') {
      onAddToCart(itemToAdd);
    } else if (cartContext && typeof cartContext.addToCart === 'function') {
      cartContext.addToCart(itemToAdd);
    }
    
    onClose();
  };

  // Function to get image URL with fallback
  const getImageUrl = () => {
    const url = item.imageUrl || item.image;
    if (!url) return '/placeholder-image.jpg';
    return url.includes('?') ? `${url}&size=large` : `${url}?size=large`;
  };

  // Check if item has customization options
  const hasCustomizationOptions = (item.variants && item.variants.length > 0) || 
                                 (item.modifierGroups && item.modifierGroups.length > 0);

  if (!hasCustomizationOptions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-dancingscript text-[#333333]">Customize {item.name}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-[#4CAF50]">
                <FaTimes />
              </button>
            </div>
            
            {/* Item Image */}
            <div className="mb-6 flex justify-center">
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={getImageUrl()} 
                  alt={item.name} 
                  className="w-full h-full object-contain bg-[#F9FFF6]"
                  onError={(e) => {
                    e.target.src = 'https://source.unsplash.com/200x200/?grocery';
                  }}
                />
              </div>
            </div>
            
            <div className="text-center py-8">
              <p className="text-[#333333] font-cinzel mb-6">No flavours or size options available for this item.</p>
              <div className="flex items-center justify-between mb-6 p-4 bg-[#F9FFF6] rounded-xl">
                <span className="font-cinzel text-[#333333]">Price:</span>
                <span className="font-dancingscript text-xl text-[#333333]">
                  ${Number(item.price || 0).toFixed(2)} CAD
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center border-2 border-[#4CAF50] rounded-xl">
                  <button 
                    className="px-4 py-2 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-l-xl"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 text-[#333333] font-cinzel font-medium">{quantity}</span>
                  <button 
                    className="px-4 py-2 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-r-xl"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="text-xl font-dancingscript text-[#333333]">
                  Total: ${calculateTotalPrice().toFixed(2)} CAD
                </div>
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#4CAF50] text-white py-3 rounded-xl flex items-center justify-center font-cinzel text-lg transition-all"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-dancingscript text-[#333333]">Customize {item.name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-[#4CAF50]">
              <FaTimes />
            </button>
          </div>
          
          {/* Item Image */}
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md">
              <img 
                src={getImageUrl()} 
                alt={item.name} 
                className="w-full h-full object-contain bg-[#F9FFF6]"
                onError={(e) => {
                  e.target.src = 'https://source.unsplash.com/200x200/?grocery';
                }}
              />
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-[#F9FFF6] rounded-xl">
            <div className="flex justify-between">
              <span className="font-cinzel text-[#333333]">Base Price:</span>
              <span className="font-dancingscript text-[#333333]">
                ${selectedVariant ? selectedVariant.price?.toFixed(2) : Number(item.price || 0).toFixed(2)} CAD
              </span>
            </div>
          </div>
          
          {/* Variants (Sizes) */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-6">
              <h4 className="font-cinzel text-[#333333] mb-3 font-medium">Size Options</h4>
              <div className="grid grid-cols-3 gap-2">
                {item.variants.map((variant, index) => (
                  <button
                    key={index}
                    className={`py-2 px-3 border-2 rounded-lg font-cinzel text-sm transition-all ${
                      selectedVariant === variant 
                        ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#333333]' 
                        : 'border-[#333333]/20 text-[#333333] hover:border-[#4CAF50]/50'
                    }`}
                    onClick={() => handleVariantChange(variant)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Modifier Groups (Flavors, Extras, etc.) */}
          {item.modifierGroups && item.modifierGroups.length > 0 && (
            <div className="mb-6">
              {item.modifierGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <h4 className="font-cinzel text-[#333333] mb-2 font-medium">{group.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {group.options && group.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        className={`py-2 px-3 border-2 rounded-lg font-cinzel text-sm transition-all ${
                          selectedModifiers[group.name] === option 
                            ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#333333]' 
                            : 'border-[#333333]/20 text-[#333333] hover:border-[#4CAF50]/50'
                        }`}
                        onClick={() => handleModifierChange(group.name, option)}
                      >
                        {option.name || option}
                        {option.price && option.price > 0 && (
                          <span className="block text-[#4CAF50] text-xs">+${option.price.toFixed(2)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity and Add to Cart */}
          <div className="pt-4 border-t border-[#4CAF50]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center border-2 border-[#4CAF50] rounded-xl">
                <button 
                  className="px-4 py-2 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-l-xl"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="px-4 py-2 text-[#333333] font-cinzel font-medium">{quantity}</span>
                <button 
                  className="px-4 py-2 text-[#333333] hover:bg-[#4CAF50]/10 transition-colors rounded-r-xl"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="text-xl font-dancingscript text-[#333333]">
                Total: ${calculateTotalPrice().toFixed(2)} CAD
              </div>
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#4CAF50] text-white py-3 rounded-xl flex items-center justify-center font-cinzel text-lg transition-all"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;