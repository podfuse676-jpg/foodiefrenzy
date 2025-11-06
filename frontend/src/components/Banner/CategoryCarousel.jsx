import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutImage from '../../assets/AboutImage.png';
import GreenTeaSmoothie from '../../assets/GreenTeaSmoothie.png';
import Cappuccino from '../../assets/Cappuccino.png';
import BreakfastBurrito from '../../assets/BreakfastBurrito.png';
import Nachos from '../../assets/Nachos.png';
import FruitWaffle from '../../assets/FruitWaffle.png';
import GranolaParfait from '../../assets/GranolaParfait.png';
import IcedLatte from '../../assets/IcedLatte.png';
import AvocadoToast from '../../assets/AvocadoToast.png';
import BagelSmash from '../../assets/BagelSmash.png';

const CategoryCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [centralImageBob, setCentralImageBob] = useState(0);

  // Define menu categories with images and colors
  const categories = [
    {
      name: 'Tea',
      image: GreenTeaSmoothie,
      color: 'from-[#8BC34A] to-[#7CB342]',
      bgColor: 'bg-[#8BC34A]/20',
      borderColor: 'border-[#8BC34A]',
      category: 'Hot Beverages'
    },
    {
      name: 'Coffee',
      image: Cappuccino,
      color: 'from-[#FF9800] to-[#FFC107]',
      bgColor: 'bg-[#FF9800]/20',
      borderColor: 'border-[#FF9800]',
      category: 'Hot Beverages'
    },
    {
      name: 'Grocery',
      image: BreakfastBurrito,
      color: 'from-[#4FC3F7] to-[#29B6F6]',
      bgColor: 'bg-[#4FC3F7]/20',
      borderColor: 'border-[#4FC3F7]',
      category: 'Grocery'
    },
    {
      name: 'Snacks',
      image: Nachos,
      color: 'from-[#FFC107] to-[#FF9800]',
      bgColor: 'bg-[#FFC107]/20',
      borderColor: 'border-[#FFC107]',
      category: 'Exotic Chips'
    },
    {
      name: 'Dairy',
      image: FruitWaffle,
      color: 'from-[#9575CD] to-[#7E57C2]',
      bgColor: 'bg-[#9575CD]/20',
      borderColor: 'border-[#9575CD]',
      category: 'Grocery'
    },
    {
      name: 'Essentials',
      image: GranolaParfait,
      color: 'from-[#81C784] to-[#66BB6A]',
      bgColor: 'bg-[#81C784]/20',
      borderColor: 'border-[#81C784]',
      category: 'Grocery'
    },
    {
      name: 'Beverages',
      image: IcedLatte,
      color: 'from-[#FF7043] to-[#FF5722]',
      bgColor: 'bg-[#FF7043]/20',
      borderColor: 'border-[#FF7043]',
      category: 'Cold Beverages'
    },
    {
      name: 'Produce',
      image: AvocadoToast,
      color: 'from-[#66BB6A] to-[#4CAF50]',
      bgColor: 'bg-[#66BB6A]/20',
      borderColor: 'border-[#66BB6A]',
      category: 'Grocery'
    },
    {
      name: 'Bakery',
      image: BagelSmash,
      color: 'from-[#8D6E63] to-[#6D4C41]',
      bgColor: 'bg-[#8D6E63]/20',
      borderColor: 'border-[#8D6E63]',
      category: 'Grocery'
    }
  ];

  // Auto-rotate carousel every 3 seconds and animate central image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
      // Create a subtle bobbing effect for the central image
      setCentralImageBob(prev => (prev + 2) % 360);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [categories.length]);

  const handleCategoryClick = (category) => {
    // Navigate to menu page with the specific category
    navigate('/menu', { state: { activeCategory: category } });
  };

  // Get visible categories (current + 2 on each side)
  const getVisibleCategories = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + categories.length) % categories.length;
      visible.push({ ...categories[index], offset: i });
    }
    return visible;
  };

  return (
    <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
      {/* Central Animated Image - Boy carrying grocery basket (placeholder for chef image) */}
      <div 
        className="relative rounded-full p-1 bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#FFC107] shadow-2xl z-20 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] mx-auto flex items-center justify-center overflow-hidden"
        style={{
          transform: `translateY(${Math.sin(centralImageBob * Math.PI / 180) * 5}px)`,
          transition: 'transform 0.1s linear'
        }}
      >
        <div className="bg-white rounded-full w-full h-full flex items-center justify-center p-2">
          <img 
            src={AboutImage} 
            alt="Central character" 
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-white/40 mix-blend-multiply" />
      </div>

      {/* Carousel Categories */}
      {getVisibleCategories().map((item, idx) => {
        // Calculate scale and opacity based on position
        const scale = 1 - Math.abs(item.offset) * 0.2;
        const opacity = 1 - Math.abs(item.offset) * 0.3;
        
        return (
          <button
            key={`${item.name}-${idx}`}
            onClick={() => handleCategoryClick(item.category)}
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full 
              bg-white border-2 ${item.borderColor} shadow-lg 
              flex flex-col items-center justify-center p-2
              transition-all duration-500 ease-in-out
              hover:scale-110 hover:shadow-xl z-10 overflow-hidden`}
            style={{
              transform: `translate(calc(-50% + ${item.offset * 80}px), calc(-50% + ${Math.abs(item.offset) * 20}px)) scale(${scale})`,
              opacity: opacity,
              zIndex: 10 - Math.abs(item.offset)
            }}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-1 overflow-hidden`}>
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {item.name}
            </span>
          </button>
        );
      })}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-[#8BC34A] w-4' : 'bg-[#8BC34A]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;