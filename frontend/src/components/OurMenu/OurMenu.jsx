import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../CartContext/CartContext';
import { FaMinus, FaPlus } from 'react-icons/fa';
import './Om.css';
import { dummyMenuData } from '../../assets/OmhDD.js';

// Separate component for each menu item to handle size selection properly
const MenuItem = ({ item, cartEntry, quantity, addToCart, updateQuantity, removeFromCart }) => {
  // State for selected size
  const [selectedSize, setSelectedSize] = useState(
    item.sizeOptions && item.sizeOptions.length > 0 
      ? item.sizeOptions[0] 
      : null
  );
  
  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (selectedSize) {
      return selectedSize.price;
    }
    return item.price;
  };
  
  return (
    <div className="relative bg-white/20 rounded-2xl overflow-hidden border border-[#f59e0b]/30 backdrop-blur-sm flex flex-col transition-all duration-500">
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-[#0ea5a4]/10">
        <img
          src={item.imageUrl || item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKAkzwvdGV4dD48L3N2Zz4='}
          alt={item.name}
          className="max-h-full max-w-full object-contain transition-all duration-700"
          onError={(e) => {
            // Set a default image if the image fails to load
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKAkzwvdGV4dD48L3N2Zz4=';
          }}
        />
      </div>
      {/* Details */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-[#2D1B0E]">
          {item.name}
        </h3>
        <p className="text-[#2D1B0E]/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
          {item.description || 'No description available'}
        </p>
        
        {/* Size Selection */}
        {item.sizeOptions && item.sizeOptions.length > 0 && (
          <div className="mb-4">
            <label className="block text-[#2D1B0E]/80 text-sm mb-1 font-cinzel">
              Size:
            </label>
            <select
              value={selectedSize ? selectedSize.size : ''}
              onChange={(e) => {
                const size = item.sizeOptions.find(s => s.size === e.target.value);
                setSelectedSize(size || null);
              }}
              className="w-full bg-white/20 border border-[#f59e0b]/30 rounded-lg px-3 py-2 text-[#2D1B0E] font-cinzel"
            >
              {item.sizeOptions.map((sizeOption) => (
                <option 
                  key={sizeOption.size} 
                  value={sizeOption.size}
                  className="bg-white text-[#2D1B0E]"
                >
                  {sizeOption.size} - ${sizeOption.price.toFixed(2)} CAD
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Price & Cart Controls */}
        <div className="mt-auto flex items-center gap-4 justify-between">
          <div className="bg-[#0ea5a4]/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
            <span className="text-xl font-bold text-[#d97706] font-dancingscript">
              ${getCurrentPrice().toFixed(2)} CAD
            </span>
          </div>
          <div className="flex items-center gap-2">
            { quantity > 0 ? (
              <>
                <button
                  onClick={() =>
                    quantity > 1
                      ? updateQuantity(cartEntry?._id, quantity - 1, selectedSize)
                      : removeFromCart(cartEntry._id)
                  }
                  className="w-8 h-8 rounded-full bg-[#0ea5a4]/40 flex items-center justify-center hover:bg-[#0ea5a4]/50 transition-colors"
                >
                  <FaMinus className="text-[#2D1B0E]" />
                </button>
                <span className="w-8 text-center text-[#2D1B0E]">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(cartEntry._id, quantity + 1, selectedSize)}
                  className="w-8 h-8 rounded-full bg-[#0ea5a4]/40 flex items-center justify-center hover:bg-[#0ea5a4]/50 transition-colors"
                >
                  <FaPlus className="text-[#2D1B0E]" />
                </button>
              </>
            ) : (
              <button
                onClick={() => addToCart(item, 1, selectedSize)}
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] px-4 py-1.5 rounded-full font-cinzel text-xs sm:text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg text-[#2D1B0E]"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OurMenu = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Convenience');
  const [menuData, setMenuData] = useState({});
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:4000/api/items');
        
        // Organize items by category
        const organizedData = {};
        
        // Organize items by category
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        console.log('Items fetched from API:', items.length);
        
        if (items.length === 0) {
          console.log('No items found in API response');
        }
        
        items.forEach(item => {
          const cat = item.category || 'Uncategorized';
          organizedData[cat] = organizedData[cat] || [];
          organizedData[cat].push(item);
        });
        
        setMenuData(organizedData);
        
        // Extract all categories from the data
        const allCategories = Object.keys(organizedData).filter(cat => cat !== 'Uncategorized');
        // Put Convenience and Food first, then other categories
        const sortedCategories = [
          ...allCategories.filter(c => c === 'Convenience' || c === 'Food').sort(),
          ...allCategories.filter(c => c !== 'Convenience' && c !== 'Food').sort()
        ].filter(cat => organizedData[cat] && organizedData[cat].length > 0);
        
        // If no categories found, use default ones
        const finalCategories = sortedCategories.length > 0 ? sortedCategories : ['Convenience', 'Food'];
        
        setCategories(finalCategories);
        
        // Set active category to the first available one if current active category doesn't exist
        if (!organizedData[activeCategory] || organizedData[activeCategory].length === 0) {
          setActiveCategory(finalCategories[0] || 'Convenience');
        }
        
        console.log('Successfully loaded items from database:', {
          categories: finalCategories,
          totalItems: items.length
        });
      } catch (err) {
        console.error('Failed to load menu items from API:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);
  
  // helper: find cart entry by product ID or item id
  const getCartEntry = id => cartItems.find(ci => ci.item && (ci.item._id === id || ci.item.id === id));
  const getQuantity  = id => getCartEntry(id)?.quantity ?? 0;
  
  // items to display in active category
  // filter out hidden items
  const rawDisplay = (menuData[activeCategory] ?? []).filter(it => !it.hidden);
  
  // Apply search filter if search query exists
  const filteredBySearch = searchQuery.trim() === '' 
    ? rawDisplay 
    : rawDisplay.filter(item => 
        item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  // Show all items (or filtered items)
  const displayItems = filteredBySearch;
  
  console.log('Display items:', displayItems.length, 'in category:', activeCategory);
  
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#fff7ed] via-[#fef3e5] to-[#fde9d0] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-[#2D1B0E]/80 text-xl font-cinzel">Loading menu items...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#fff7ed] via-[#fef3e5] to-[#fde9d0] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#2D1B0E]/80 text-xl font-cinzel mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#0ea5a4]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#0ea5a4]/50 transition duration-300 text-[#2D1B0E]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-[#fff7ed] via-[#fef3e5] to-[#fde9d0] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#f59e0b]">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2">
            Our Exquisite Menu
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-[#2D1B0E]/80">
            A Symphony of Flavors
          </span>
        </h2>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/20 border-2 border-[#f59e0b]/30 text-[#2D1B0E] placeholder-[#2D1B0E]/50 focus:outline-none focus:border-[#0ea5a4] focus:bg-white/30 transition-all font-cinzel"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D1B0E]/70 hover:text-[#2D1B0E] transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center mt-3 text-[#2D1B0E]/60 font-cinzel text-sm">
              Found {displayItems.length} item{displayItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm ${
                  activeCategory === cat
                    ? 'bg-gradient-to-br from-[#0ea5a4]/80 to-[#f59e0b]/80 border-[#0ea5a4] scale-105 shadow-xl shadow-[#0ea5a4]/30 text-[#2D1B0E]'
                    : 'bg-white/20 border-[#f59e0b]/30 text-[#2D1B0E]/80 hover:bg-white/40 hover:scale-95'
                }`}
              >
                {cat}
              </button>
            ))
          ) : (
            <p className="text-[#2D1B0E]/80 font-cinzel">No categories available</p>
          )}
        </div>
        
        {/* Menu Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems && displayItems.length > 0 ? (
            displayItems.map((item, i) => {
              // Skip items without valid data
              if (!item || (!item._id && !item.id)) {
                return null;
              }
              
              const cartEntry = getCartEntry(item._id || item.id);
              const quantity = cartEntry?.quantity || 0;
              
              return (
                <MenuItem
                  key={item._id || item.id || `menu-item-${i}`}
                  item={item}
                  cartEntry={cartEntry}
                  quantity={quantity}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#2D1B0E]/80 text-xl font-cinzel">
                No items found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurMenu;