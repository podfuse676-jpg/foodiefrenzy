import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutImage from '../../assets/AboutImage.png';
import GreenTeaSmoothie from '../../assets/GreenTeaSmoothie.png';
import Cappuccino from '../../assets/Cappuccino.png';
import BreakfastBurrito from '../../assets/BreakfastBurrito.png';
import Nachos from '../../assets/Nachos.png';
import IcedLatte from '../../assets/IcedLatte.png';
import FruitWaffle from '../../assets/FruitWaffle.png';

const CircularMenu = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
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
      name: 'Beverages',
      image: IcedLatte,
      color: 'from-[#9575CD] to-[#7E57C2]',
      bgColor: 'bg-[#9575CD]/20',
      borderColor: 'border-[#9575CD]',
      category: 'Cold Beverages'
    },
    {
      name: 'Dairy',
      image: FruitWaffle,
      color: 'from-[#81C784] to-[#66BB6A]',
      bgColor: 'bg-[#81C784]/20',
      borderColor: 'border-[#81C784]',
      category: 'Grocery'
    }
  ];

  // Auto-rotate the categories and animate the central image
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
      // Create a subtle bobbing effect for the central image
      setCentralImageBob(prev => (prev + 2) % 360);
    }, 50); // Adjust speed as needed (lower = faster)
    
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to menu page with the specific category
    navigate('/menu', { state: { activeCategory: category } });
  };

  return (
    <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
      {/* Central Animated Image - Boy carrying grocery basket (placeholder for chef image) */}
      <div 
        className="relative rounded-full p-1 bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#FFC107] shadow-2xl z-20 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] mx-auto flex items-center justify-center overflow-hidden"
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

      {/* Circular Category Items with smooth rotation */}
      {categories.map((item, index) => {
        // Calculate positions in a circle with rotation
        const angle = (index * 60) + rotation; // 6 items, 60 degrees apart
        const radius = 120; // Distance from center
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        return (
          <button
            key={item.name}
            onClick={() => handleCategoryClick(item.category)}
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-full 
              bg-white border-2 ${item.borderColor} shadow-lg 
              flex flex-col items-center justify-center p-2
              transition-all duration-300 hover:scale-110 hover:shadow-xl
              group-hover:animate-pulse overflow-hidden z-10`}
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-angle}deg)`,
              transition: 'transform 0.1s linear'
            }}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-1 overflow-hidden`}>
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
    </div>
  );
};

export default CircularMenu;