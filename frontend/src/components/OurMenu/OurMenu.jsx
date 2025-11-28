import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiX } from 'react-icons/fi';
import MenuItem from './MenuItem';
import ItemDetailView from './ItemDetailView';
import './Om.css';
import { useCart } from '../../CartContext/CartContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getItems } from '../../utils/api';

const OurMenu = () => {
  const [menuData, setMenuData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Fruits');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  const ref = useRef();
  const inView = true; // Simplified for now since we're not using intersection observer
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        NProgress.start();
        setError(null);
        
        // Remove fallback data to ensure we always show real backend data
        const items = await getItems();
        
        console.log('Items fetched from API:', items.length);
        
        if (items.length === 0) {
          console.log('No items found in API response');
        }
        
        // Organize items by category
        const organizedData = {};
        
        items.forEach(item => {
          const cat = item.category || 'Uncategorized';
          organizedData[cat] = organizedData[cat] || [];
          organizedData[cat].push(item);
        });
        
        setMenuData(organizedData);
        
        // Extract all categories from the data
        const allCategories = Object.keys(organizedData).filter(cat => cat !== 'Uncategorized');
        // Put grocery categories first, then other categories
        const groceryCategories = ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Essentials'];
        const otherCategories = allCategories.filter(c => !groceryCategories.includes(c)).sort();
        const sortedCategories = [
          ...groceryCategories.filter(c => organizedData[c] && organizedData[c].length > 0),
          ...otherCategories
        ].filter(cat => organizedData[cat] && organizedData[cat].length > 0);

        // If no categories found, use default grocery categories
        const finalCategories = sortedCategories.length > 0 ? sortedCategories : ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Essentials'];

        setCategories(finalCategories);

        // Set active category to the first available one if current active category doesn't exist
        if (!organizedData[activeCategory] || organizedData[activeCategory].length === 0) {
          setActiveCategory(finalCategories[0] || 'Fruits');
        }
        
        console.log('Successfully loaded items from API:', {
          categories: finalCategories,
          totalItems: items.length
        });
      } catch (err) {
        console.error('Failed to load menu items from API:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
        NProgress.done();
      }
    };
    fetchMenu();
  }, []);
  
  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    // This is handled by the Intersection Observer hook
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
      <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="skeleton h-16 w-3/4 mx-auto mb-4 rounded-full" />
            <div className="skeleton h-8 w-1/2 mx-auto rounded-full" />
          </div>
          
          {/* Search bar skeleton */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="skeleton h-14 rounded-full" />
          </div>
          
          {/* Category tabs skeleton */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
          
          {/* Product grid skeleton */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#333333]/80 text-xl font-cinzel mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#4CAF50]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#4CAF50]/50 transition duration-300 text-[#333333]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={ref}
      className={`bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-90'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title - improved for mobile */}
        <h2 className="text-center mb-6 sm:mb-8">
          <span className="font-dancingscript block text-4xl sm:text-5xl md:text-6xl mb-2 bg-gradient-to-r from-[#4CAF50] via-[#F4D03F] to-[#4CAF50] bg-clip-text text-transparent">
            Our Grocery Selection
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl font-cinzel mt-3 sm:mt-4 text-[#333333]/80">
            Fresh & Quality Products
          </span>
        </h2>
        
        {/* Fixed content for indexing purposes - Updated for better SEO - Force redeploy 1 */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-cinzel text-[#333333]/90 mb-4">
            Explore Our Menu Items
          </p>
          <p className="text-base sm:text-lg text-[#333333]/80 font-playfair max-w-3xl mx-auto">
            Discover a wide variety of fresh groceries, quality products, and convenience items. 
            From farm-fresh fruits and vegetables to specialty beverages and snacks, we have everything 
            you need for your weekly shopping. All items are carefully selected and delivered fresh 
            to your door across Canada.
          </p>
        </div>
        
        {/* Search Bar - improved for mobile */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search grocery items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-[#FAFAFA]/20 border-2 border-[#4CAF50]/30 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:border-[#4CAF50] focus:bg-[#FAFAFA]/30 transition-all font-cinzel text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#333333]/70 hover:text-[#333333] transition-colors text-sm sm:text-base"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center mt-2 sm:mt-3 text-[#333333]/60 font-cinzel text-xs sm:text-sm">
              Found {displayItems.length} item{displayItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Category Tabs - improved for mobile */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-16">
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-xs sm:text-sm tracking-widest backdrop-blur-sm ${
                  activeCategory === cat
                    ? 'bg-gradient-to-br from-[#4CAF50]/80 to-[#388E3C]/80 border-[#4CAF50] scale-105 shadow-xl shadow-[#4CAF50]/30 text-[#FAFAFA]'
                    : 'bg-[#4CAF50]/20 border-[#4CAF50]/30 text-[#333333] font-bold hover:bg-[#4CAF50]/40 hover:scale-95'
                }`}
              >
                {cat}
              </button>
            ))
          ) : (
            <p className="text-[#333333]/80 font-cinzel text-sm sm:text-base">No categories available</p>
          )}
        </div>
        
        {/* Menu Grid - improved for mobile with scroll animations */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems && displayItems.length > 0 ? (
            displayItems.map((item, i) => {
              // Skip items without valid data
              if (!item || (!item._id && !item.id)) {
                return null;
              }
              
              const cartEntry = getCartEntry(item._id || item.id);
              const quantity = getQuantity(item._id || item.id);
              
              return (
                <div 
                  key={item._id || item.id}
                  className={`transition-all duration-300 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <MenuItem
                    item={item}
                    cartEntry={cartEntry}
                    quantity={quantity}
                    addToCart={addToCart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    onOpenDetail={() => setSelectedItem(item)}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#333333]/80 font-cinzel text-lg">
                No items found in this category
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 bg-[#4CAF50]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#4CAF50]/50 transition duration-300 text-[#333333]"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Additional fixed content for indexing */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-[#4CAF50]/20">
        <h3 className="text-2xl font-dancingscript text-[#4CAF50] text-center mb-4">Quality Grocery Delivery Across Canada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-cinzel text-[#333333] mb-2">Fresh Produce & Groceries</h4>
            <p className="text-[#333333]/80 font-playfair">
              Our menu features farm-fresh fruits, organic vegetables, quality dairy products, and essential groceries. 
              We source directly from local suppliers to ensure the highest quality and freshness of all our items.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-cinzel text-[#333333] mb-2">Convenience & Specialty Items</h4>
            <p className="text-[#333333]/80 font-playfair">
              Beyond basic groceries, we offer specialty beverages, exotic snacks, household essentials, and unique 
              convenience items. Everything you need for daily life, delivered fast to your door nationwide.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-[#333333]/70 font-cinzel italic">
            Order online and get your groceries delivered fresh across Canada
          </p>
        </div>
      </div>
      
      {/* Item Detail View Modal */}
      {selectedItem && (
        <ItemDetailView 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item, quantity, variant, flavors) => {
            addToCart(item, quantity, variant, flavors);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

// Skeleton components (these were referenced but not defined)
const CategorySkeleton = () => (
  <div className="skeleton h-8 w-24 rounded-full" />
);

const ProductCardSkeleton = () => (
  <div className="skeleton h-64 rounded-2xl" />
);

export default OurMenu;