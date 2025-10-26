import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../CartContext/CartContext';
import MenuItem from './MenuItem';
import ItemDetailView from './ItemDetailView';
import apiConfig from '../../utils/apiConfig';
import './Om.css';

const OurMenu = () => {
  const [menuData, setMenuData] = useState({});
  const [activeCategory, setActiveCategory] = useState('Hot Beverages'); // Default to first subcategory
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  const url = apiConfig.baseURL;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Define the exact subcategory order as required with emojis
  const productSubCategories = [
    { name: 'Hot Beverages', emoji: '☕' },
    { name: 'Cold Beverages', emoji: '🧃' },
    { name: 'Hot Food', emoji: '🍔' },
    { name: 'Exotic Chips', emoji: '🍟' },
    { name: 'Exotic Drinks', emoji: '🥤' },
    { name: 'Grocery', emoji: '🛒' },
    { name: 'Novelties', emoji: '🎁' },
    { name: 'Car Accessories', emoji: '🚗' },
    { name: 'Smokes & Vapes', emoji: '🚬' }
  ];
  
  // Category images - you can replace these with your own images
  // Format: 'Category Name': 'Image URL'
  const categoryImages = {
    'Hot Beverages': 'https://source.unsplash.com/200x200/?coffee,tea',
    'Cold Beverages': 'https://source.unsplash.com/200x200/?cold,drinks',
    'Hot Food': 'https://source.unsplash.com/200x200/?hot,food',
    'Exotic Chips': 'https://source.unsplash.com/200x200/?chips,snacks',
    'Exotic Drinks': 'https://source.unsplash.com/200x200/?exotic,drinks',
    'Grocery': 'https://source.unsplash.com/200x200/?grocery,food',
    'Novelties': 'https://source.unsplash.com/200x200/?novelty,items',
    'Car Accessories': 'https://source.unsplash.com/200x200/?car,accessories',
    'Smokes & Vapes': 'https://source.unsplash.com/200x200/?smoking,vapes'
  };
  
  // Set active category from location state if provided
  useEffect(() => {
    if (location.state && location.state.activeCategory) {
      setActiveCategory(location.state.activeCategory);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${url}/api/items`);
        
        // Organize items by category
        const organizedData = {};
        
        // Organize items by category
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        console.log('Items fetched from API:', items.length);
        
        if (items.length === 0) {
          console.log('No items found in API response');
        }
        
        // Categorize items based on their category field
        items.forEach(item => {
          const category = item.category || 'Uncategorized';
          
          // Add item to its assigned category
          organizedData[category] = organizedData[category] || [];
          organizedData[category].push(item);
        });
        
        setMenuData(organizedData);
        
        // Set active category to the first subcategory by default if not already set
        if (!location.state || !location.state.activeCategory) {
          setActiveCategory('Hot Beverages');
        }
        
        console.log('Successfully loaded and categorized items from database:', {
          categories: Object.keys(organizedData),
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
  
  // Close item detail view
  const closeItemDetail = () => {
    setSelectedItem(null);
    navigate('/menu');
  };
  
  // Open item detail view
  const openItemDetail = (item) => {
    setSelectedItem(item);
    navigate(`/item/${item._id || item.id}`);
  };
  
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
      // Updated to light fresh colors
      <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-gray-800/80 text-xl font-cinzel">Loading grocery items...</p>
      </div>
    );
  }

  if (error) {
    return (
      // Updated to light fresh colors
      <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800/80 text-xl font-cinzel mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#8BC34A]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#8BC34A]/50 transition duration-300 text-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    // Updated to light fresh colors
    <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#8BC34A] via-[#FFC107] to-[#8BC34A]">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2">
            Our Product Categories
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-gray-800/80">
            Explore Our Delicious Offerings
          </span>
        </h2>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search grocery items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/20 border-2 border-[#8BC34A]/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#8BC34A] focus:bg-white/30 transition-all font-cinzel"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800/70 hover:text-gray-800 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center mt-3 text-gray-800/60 font-cinzel text-sm">
              Found {displayItems.length} item{displayItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Sub-category navigation - exact order as requested with emojis */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {productSubCategories.map(subCat => (
            <button
              key={subCat.name}
              onClick={() => setActiveCategory(subCat.name)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-base flex items-center gap-2 ${
                activeCategory === subCat.name
                  ? 'bg-gradient-to-br from-[#8BC34A]/80 to-[#7CB342]/80 border-[#8BC34A] scale-105 shadow-xl shadow-[#8BC34A]/30 text-white'
                  : 'border-[#8BC34A]/30 text-gray-800 hover:bg-[#8BC34A]/20 hover:scale-95'
              }`}
            >
              <span>{subCat.emoji}</span>
              <span>{subCat.name}</span>
            </button>
          ))}
        </div>
        
        {/* Category Header with Emoji */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-dancingscript text-gray-800 flex items-center justify-center gap-3">
            <span>{productSubCategories.find(cat => cat.name === activeCategory)?.emoji || '📦'}</span>
            <span>{activeCategory}</span>
          </h3>
        </div>
        
        {/* Menu Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayItems && displayItems.length > 0 ? (
            displayItems.map((item, i) => {
              // Skip items without valid data
              if (!item || (!item._id && !item.id)) {
                return null;
              }
              
              const cartEntry = getCartEntry(item._id || item.id);
              const quantity = cartEntry?.quantity || 0;
              
              return (
                <div 
                  key={item._id || item.id || `menu-item-${i}`}
                >
                  <MenuItem
                    item={item}
                    cartEntry={cartEntry}
                    quantity={quantity}
                    addToCart={addToCart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    category={activeCategory}
                    onOpenDetail={() => openItemDetail(item)}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-800/80 text-xl font-cinzel">
                No items found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Item Detail View */}
      {selectedItem && (
        <ItemDetailView 
          item={selectedItem} 
          onClose={closeItemDetail} 
        />
      )}
    </div>
  );
};

export default OurMenu;