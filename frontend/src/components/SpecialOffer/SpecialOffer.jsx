import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import { FaStar, FaHeart, FaPlus, FaFire } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { useCart } from '../../CartContext/CartContext';
import FloatingParticle from '../FloatingParticle/FloatingParticle';

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const { addToCart, updateQuantity, removeFromCart, cartItems: rawCart } = useCart();

  // only keep cart entries with a real `item`
  const cartItems = rawCart.filter(ci => ci.item);


  // Fetch menu items
  useEffect(() => {
    axios
      .get(`${apiConfig.baseURL}/api/items`)
      .then(res => {
        const data = res.data;
        // Handle different response formats and ensure we always have an array
        if (data && Array.isArray(data)) {
          setItems(data);
        } else if (data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
          console.warn('Unexpected data format from API:', data);
        }
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setItems([]); // Set empty array on error
      });
  }, []);

  const displayList = Array.isArray(items) ? items.slice(0, showAll ? 8 : 4) : [];

  return (
    // Updated to light fresh colors
    <div className="bg-gradient-to-b from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-16 px-4 font-['Poppins']">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          {/* Updated to fresh green and muted yellow colors */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent italic">
            Today's <span className="text-stroke-gold">Special</span> Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fresh deals on quality groceries delivered to your door
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayList.map(item => {
            // Add additional null checks to prevent errors
            const cartItem = cartItems.find(ci => ci && ci.item && ci.item._id === item._id);
            const qty = cartItem && cartItem.quantity ? cartItem.quantity : 0;
            const cartId = cartItem && cartItem._id ? cartItem._id : null;

            return (
              <div
                key={item._id}
                className="relative group bg-white rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-4 transition duration-500 hover:shadow-[#8BC34A]/40 border-2 border-transparent hover:border-[#8BC34A]/20"
              >
                {/* Image & Stats */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                    alt={item.name}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-110 duration-500"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="flex items-center gap-2 text-[#8BC34A]">
                      <FaStar /><b>{item.rating}</b>
                    </span>
                    <span className="flex items-center gap-2 text-[#FFC107]">
                      <FaHeart /><b>{item.hearts}</b>
                    </span>
                  </div>
                </div>

                {/* Content & Cart Controls */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent italic">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-2xl font-bold text-[#8BC34A]">
                      ${Number(item.price).toFixed(2)} CAD
                    </span>

                    {qty > 0 ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            qty > 1
                              ? updateQuantity(cartId, qty - 1)
                              : removeFromCart(cartId)
                          }
                          className="w-8 h-8 rounded-full bg-[#8BC34A]/40 flex items-center justify-center"
                        >
                          <HiMinus className="w-4 h-4 text-gray-800" />
                        </button>
                        <span className="w-8 text-center text-gray-800">{qty}</span>
                        <button
                          onClick={() => updateQuantity(cartId, qty + 1)}
                          className="w-8 h-8 rounded-full bg-[#8BC34A]/40 flex items-center justify-center"
                        >
                          <HiPlus className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          try {
                            if (item && item._id) {
                              addToCart(item, 1);
                            } else {
                              console.error('Cannot add item to cart: Invalid item data');
                            }
                          } catch (error) {
                            console.error('Error adding to cart:', error);
                          }
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white px-5 py-2.5 rounded-xl font-bold"
                      >
                        <FaPlus />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Floating Particles */}
                <FloatingParticle className="opacity-0 group-hover:opacity-100 absolute inset-0 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white px-8 py-4 rounded-2xl font-bold uppercase"
          >
            <FaFire className="animate-pulse" />
            <span>{showAll ? 'Show Less' : 'Show More'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;