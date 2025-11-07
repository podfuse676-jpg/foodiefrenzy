import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { bannerAssets } from '../../assets/dummydata';
import CategoryRotator from './CategoryRotator';
import "../../index.css";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { bannerImage } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to menu page with search query
      navigate('/menu', { state: { searchQuery: searchQuery.trim() } });
    }
  };

  return (
    <div className="relative">
      {/* Updated to light fresh colors */}
      <div className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8BC34A]/10 to-[#FFECB3]/10" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative md:pr-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
              Fresh Groceries <br />
              {/* Updated to fresh green and light cream colors */}
              <span className="text-[#8BC34A] bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text">
                Delivered to Your Door
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-gray-700 max-w-xl opacity-90 mx-auto md:mx-0">
              Fresh produce and quality groceries delivered fast. Your weekly shopping made easy and convenient.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0 group">
              <div className="relative flex items-center bg-white/80 rounded-xl border-2 border-[#8BC34A]/30 shadow-2xl hover:border-[#FFC107]/50 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-xl text-[#8BC34A]/80 icon-smooth" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find fresh produce and groceries..."
                  className="w-full py-4 pr-6 bg-transparent outline-none placeholder-gray-500 text-lg font-medium tracking-wide input-focus"
                />
                <button
                  type="submit"
                  className="mr-4 px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] rounded-lg font-semibold text-white hover:from-[#FFC107] hover:to-[#8BC34A] transition-all duration-300 shadow-lg hover:shadow-[#FFC107]/20 btn-subtle-hover"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Content - Only Rotator view */}
          <div className="relative">
            <CategoryRotator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;