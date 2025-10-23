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
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative md:pr-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
              We're Serious <br />
              <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text">
                For Food & Delivery
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-amber-100 max-w-xl opacity-90 mx-auto md:mx-0">
              Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto md:mx-0 group">
              <div className="relative flex items-center bg-amber-900/30 rounded-xl border-2 border-amber-500/30 shadow-2xl hover:border-amber-400/50 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-xl text-amber-400/80" />
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
                  className="mr-4 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-300 rounded-lg font-semibold text-amber-900 hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-lg hover:shadow-amber-300/20"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <button className="group flex items-center gap-3 bg-amber-800/30 hover:bg-amber-800/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-400 backdrop-blur-sm">
                <FaDownload className="text-xl text-amber-400 group-hover:animate-bounce" />
                <span className="text-lg">Download App</span>
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-300/30"
              >
                <FaPlay className="text-xl text-amber-900" />
                <span className="text-lg text-amber-900 font-semibold">Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Image Container with Orbiting Images */}
          <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            {/* Main Banner Image - Static, no animation */}
            <div className="relative rounded-full p-1 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-400 shadow-2xl z-20 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] mx-auto flex items-center justify-center">
              <img
                src={bannerImage}
                alt="Girl Banner"
                className="rounded-full border-4 sm:border-8 border-amber-900/50 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-multiply" />
            </div>

            {/* Orbiting Images - Only 4 dishes */}
            {orbitImages.slice(0, 4).map((imgSrc, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                  ${index === 0 ? 'orbit' : `orbit-delay-${index * 5}`} 
                  w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]`}
              >
                <img
                  src={imgSrc}
                  alt={`Orbiting ${index + 1}`}
                  className="w-full h-full rounded-full border border-amber-500/30 shadow-lg bg-amber-900/20 p-1 object-cover"
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