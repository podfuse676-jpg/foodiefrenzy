import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const FlavorSelection = ({ 
  flavors = [], 
  selectedFlavors = [], 
  onFlavorChange, 
  multipleSelection = true,
  title = "Flavor Options"
}) => {
  const [animatingFlavors, setAnimatingFlavors] = useState([]);

  // Handle flavor selection with animation
  const handleFlavorClick = (flavor) => {
    // Trigger animation
    setAnimatingFlavors(prev => [...prev, flavor]);
    setTimeout(() => {
      setAnimatingFlavors(prev => prev.filter(f => f !== flavor));
    }, 300);

    if (multipleSelection) {
      // For multiple selection, toggle the flavor
      if (selectedFlavors.includes(flavor)) {
        onFlavorChange(selectedFlavors.filter(f => f !== flavor));
      } else {
        onFlavorChange([...selectedFlavors, flavor]);
      }
    } else {
      // For single selection, select only this flavor
      onFlavorChange([flavor]);
    }
  };

  // Check if a flavor is selected
  const isFlavorSelected = (flavor) => {
    return selectedFlavors.includes(flavor);
  };

  // Check if a flavor is animating
  const isFlavorAnimating = (flavor) => {
    return animatingFlavors.includes(flavor);
  };

  // Don't render if no flavors available
  if (!flavors || flavors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {title && (
        <h3 className="font-dancingscript text-xl text-gray-800 mb-3">{title}</h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
        {flavors.map((flavor, index) => (
          <button
            key={index}
            onClick={() => handleFlavorClick(flavor)}
            className={`relative px-4 py-3 border-2 rounded-lg font-cinzel transition-all text-left flex items-center gap-3 ${
              isFlavorSelected(flavor)
                ? 'border-[#8BC34A] bg-[#8BC34A]/10 text-gray-800 shadow-sm'
                : 'border-gray-800/20 text-gray-800 hover:border-[#8BC34A]/50 hover:bg-[#8BC34A]/5'
            } ${
              isFlavorAnimating(flavor) ? 'scale-105' : ''
            } transform transition-transform duration-200`}
            aria-label={`Select ${flavor} flavor`}
          >
            {/* Custom animated checkbox */}
            <div className={`flex items-center justify-center w-6 h-6 rounded border-2 flex-shrink-0 transition-all duration-300 ${
              isFlavorSelected(flavor)
                ? 'bg-[#8BC34A] border-[#8BC34A] scale-105'
                : 'border-gray-800/30'
            }`}>
            {isFlavorSelected(flavor) && (
              <FaCheck className="text-white text-sm animate-pop-in" />
            )}
          </div>
          <span className="font-medium text-base truncate">{flavor}</span>
        </button>
      ))}
    </div>
  </div>
);
};

export default FlavorSelection;