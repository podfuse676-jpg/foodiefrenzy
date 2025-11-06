import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GreenTeaSmoothie from '../../assets/GreenTeaSmoothie.png';
import Cappuccino from '../../assets/Cappuccino.png';
import BreakfastBurrito from '../../assets/BreakfastBurrito.png';
import Nachos from '../../assets/Nachos.png';
import IcedLatte from '../../assets/IcedLatte.png';

const CategoryRotator = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [centralImageBob, setCentralImageBob] = useState(0);

  // Define rotating categories with images
  const categories = [
    {
      name: 'Tea',
      image: GreenTeaSmoothie,
      category: 'Hot Beverages'
    },
    {
      name: 'Coffee',
      image: Cappuccino,
      category: 'Hot Beverages'
    },
    {
      name: 'Grocery',
      image: BreakfastBurrito,
      category: 'Grocery'
    },
    {
      name: 'Snacks',
      image: Nachos,
      category: 'Exotic Chips'
    },
    {
      name: 'Beverages',
      image: IcedLatte,
      category: 'Cold Beverages'
    }
  ];

  // Auto-rotate the categories and animate the central image
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
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
      {/* Central Circle with Zoomed Boy Image */}
      <div 
        className="relative z-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F9FFF6] to-[#E8F5E9] shadow-lg border-2 border-[#8BC34A]/20"
        style={{
          width: '300px',
          height: '300px',
          transform: `translateY(${Math.sin(centralImageBob * Math.PI / 180) * 5}px)`,
          transition: 'transform 0.1s linear'
        }}
      >
        <div className="bg-white rounded-full w-full h-full flex items-center justify-center p-2">
          <img 
            src="https://img.freepik.com/premium-vector/adorable-young-boy-carrying-basket-full-groceries-cartoon_1323048-9028.jpg" 
            alt="Cute animated boy holding a grocery basket" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Rotating Category Items in Orbit */}
      {categories.map((item, index) => {
        // Calculate positions in a circle with rotation
        const angle = (index * 72) + rotation; // 5 items, 72 degrees apart (360/5)
        const radius = 180; // Increased radius to accommodate larger center
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        return (
          <button
            key={item.name}
            onClick={() => handleCategoryClick(item.category)}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-20 h-20 rounded-full 
              bg-white border-2 border-[#8BC34A] shadow-lg 
              flex flex-col items-center justify-center p-3
              transition-all duration-300 hover:scale-110 hover:shadow-xl
              overflow-hidden z-10"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-angle}deg)`,
              transition: 'transform 0.1s linear'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#7CB342] flex items-center justify-center mb-1 overflow-hidden">
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

export default CategoryRotator;