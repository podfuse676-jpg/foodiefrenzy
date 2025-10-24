import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';
import apiConfig from '../../utils/apiConfig';
import './Omh.css';

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Essentials'];

const OurMenuHome = () => {
  const [activeCategory, setActiveCategory] = useState('Convenience');
  const [menuData, setMenuData] = useState({});
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const url = apiConfig.baseURL;

  const cartItems = rawCart.filter(ci => ci.item);

  useEffect(() => {
    axios.get(`${url}/api/items`)
      .then(res => {
        // Organize items by category
        const organizedData = {};
        
        // Organize items by category
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        items.forEach(item => {
          const cat = item.category || 'Uncategorized';
          organizedData[cat] = organizedData[cat] || [];
          organizedData[cat].push(item);
        });
        
        setMenuData(organizedData);
        console.log('Successfully combined database and dummy data in OurMenuHome');
      })
      .catch(err => {
        console.error('Failed to load menu items from API, using dummy data instead');
        // Already using dummy data as default state
      });
  }, []);

  // Find cart entry by product ID or item id
  const getCartEntry = id => cartItems.find(ci => ci.item?._id === id || ci.item?.id === id);
  const getQuantity = id => getCartEntry(id)?.quantity ?? 0;
  const rawDisplay = (menuData[activeCategory] || []).filter(it => !it.hidden);
  const displayItems = rawDisplay.slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#FAFAFA] via-[#F4D03F] to-[#FAFAFA]">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2">
            Our Grocery Selection
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-[#333333]/80">
            Fresh & Quality Products
          </span>
        </h2>

        {/* Category buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm ${
                activeCategory === cat
                  ? 'bg-gradient-to-br from-[#4CAF50]/80 to-[#388E3C]/80 border-[#4CAF50] scale-105 shadow-xl shadow-[#4CAF50]/30'
                  : 'bg-[#4CAF50]/20 border-[#4CAF50]/30 text-[#FAFAFA]/80 hover:bg-[#4CAF50]/40 hover:scale-95'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {displayItems.map((item, i) => {
            const qty = getQuantity(item._id);
            const cartEntry = getCartEntry(item._id);

            return (
              <div
                key={item._id || `menu-item-${i}`}
                className="relative bg-[#4CAF50]/20 rounded-2xl overflow-hidden border border-[#4CAF50]/30 backdrop-blur-sm flex flex-col transition-all duration-500"
                style={{ '--index': i }}
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                  <img
                    src={item.imageUrl || item.image || null}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#4CAF50]/50 to-transparent opacity-50 transition-all duration-300" />
                  <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-[#333333] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[#333333]/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                    {item.description}
                  </p>

                  {/* Price & Cart Controls */}
                  <div className="mt-auto flex items-center gap-4 justify-between">
                    <div className="bg-[#FAFAFA]/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                      <span className="text-xl font-bold text-[#F4D03F] font-dancingscript">
                        ${Number(item.price).toFixed(2)} CAD
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              qty > 1
                                ? updateQuantity(cartEntry?._id, qty - 1)
                                : removeFromCart(cartEntry._id)
                            }
                            className="w-8 h-8 rounded-full bg-[#4CAF50]/40 flex items-center justify-center hover:bg-[#4CAF50]/50 transition-colors"
                          >
                            <FaMinus className="text-[#FAFAFA]" />
                          </button>
                          <span className="w-8 text-center text-[#333333]">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(cartEntry._id, qty + 1)}
                            className="w-8 h-8 rounded-full bg-[#4CAF50]/40 flex items-center justify-center hover:bg-[#4CAF50]/50 transition-colors"
                          >
                            <FaPlus className="text-[#FAFAFA]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#4CAF50] px-4 py-1.5 rounded-full font-cinzel text-xs sm:text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full menu link */}
        <div className="flex justify-center mt-16">
          <Link
            to="/menu"
            className="bg-[#4CAF50]/30 border-2 border-[#4CAF50]/30 text-[#FAFAFA] px-8 sm:px-10 py-3 rounded-full font-cinzel uppercase tracking-widest transition-all duration-300 hover:bg-[#4CAF50]/40 hover:text-[#FAFAFA] hover:scale-105 hover:shadow-lg hover:shadow-[#4CAF50]/20 backdrop-blur-sm"
          >
            Explore Full Grocery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurMenuHome;