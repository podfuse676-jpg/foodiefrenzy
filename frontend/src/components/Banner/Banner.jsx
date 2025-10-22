import React, { useState } from 'react';
import { FaSearch, FaDownload, FaPlay, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { bannerAssets } from '../../assets/dummydata';
import "../../index.css";

const Banner = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { bannerImage, orbitImages, video } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to menu page with search query
      navigate('/menu', { state: { searchQuery: searchQuery.trim() } });
    }
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-[#2D1B0E] via-[#d97706] to-[#f59e0b] text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B0E]/20 to-[#0ea5a4]/10" />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative md:pr-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
              We're Serious <br />
              <span className="text-[#fff7ed] bg-gradient-to-r from-[#fff7ed] to-amber-100 bg-clip-text">
                For Food & Delivery
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-amber-100 max-w-xl opacity-90 mx-auto lg:mx-0">
              Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto lg:mx-0 group">
              <div className="relative flex items-center bg-[#2D1B0E]/30 rounded-xl border-2 border-[#0ea5a4]/30 shadow-2xl hover:border-[#fff7ed]/50 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-xl text-[#0ea5a4]/80" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover your next favorite meal..."
                  className="w-full py-4 pr-6 bg-transparent outline-none placeholder-amber-200/70 text-lg font-medium tracking-wide"
                />
                <button
                  type="submit"
                  className="mr-4 px-6 py-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg font-semibold text-[#2D1B0E] hover:from-[#d97706] hover:to-[#f59e0b] transition-all duration-300 shadow-lg hover:shadow-[#fff7ed]/20"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-6">
              <button className="group flex items-center gap-3 bg-[#2D1B0E]/30 hover:bg-[#2D1B0E]/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#0ea5a4]/50 hover:border-[#fff7ed]/50 backdrop-blur-sm">
                <FaDownload className="text-xl text-[#0ea5a4] group-hover:animate-bounce" />
                <span className="text-lg">Download App</span>
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#fff7ed]/30"
              >
                <FaPlay className="text-xl text-[#2D1B0E]" />
                <span className="text-lg text-[#2D1B0E] font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Image Container with Orbiting Images */}
          <div className="flex-1 relative group mt-8 lg:mt-0 min-h-[300px] sm:min-h-[400px]">
            {/* Main Banner Image */}
            <div className="relative rounded-full p-1 bg-gradient-to-br from-[#0ea5a4] via-[#d97706] to-[#f59e0b] shadow-2xl z-20 w-[200px] xs:w-[250px] sm:w-[300px] md:w-[350px] h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] mx-auto">
              <img
                src={bannerImage}
                alt="Girl Banner"
                className="rounded-full border-4 xs:border-8 border-[#2D1B0E]/50 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-[#2D1B0E]/40 mix-blend-multiply" />
            </div>

            {/* Orbiting Images */}
            {orbitImages.map((imgSrc, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                  ${index === 0 ? 'orbit' : `orbit-delay-${index * 5}`} 
                  w-[60px] xs:w-[80px] sm:w-[100px] md:w-[120px] h-[60px] xs:h-[80px] sm:h-[100px] md:h-[120px]`}
              >
                <img
                  src={imgSrc}
                  alt={`Orbiting ${index + 1}`}
                  className="w-full h-full rounded-full border-2 border-[#0ea5a4]/30 shadow-lg bg-[#2D1B0E]/20 p-1 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-3xl z-10 transition-all"
          >
            <FaTimes />
          </button>
          <div className="w-full max-w-4xl mx-auto">
            <video
              controls
              autoPlay
              className="w-full aspect-video object-contain rounded-lg shadow-2xl"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;