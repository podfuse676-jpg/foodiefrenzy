import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AboutHome.css';
import FloatingParticle from '../FloatingParticle/FloatingParticle';
import { aboutfeature } from '../../assets/dummydata';

const AboutHome = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Function to close modal when clicking outside
  const closeModal = (e) => {
    if (e.target.id === 'about-modal-backdrop') {
      setShowAboutModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-10 sm:py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-20 w-96 h-96 bg-[#8BC34A]/20 rounded-full blur-3xl mix-blend-soft-light"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFECB3]/15 rounded-full blur-3xl mix-blend-soft-light"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Content box - wide and rectangular, fitting content exactly */}
          <div className="w-full bg-white p-8 rounded-xl shadow-lg border-2 border-[#8BC34A]/30 transform transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent">
                    Fresh & Quality Groceries
                  </span>
                  <br />
                  <span className="inline-block mt-3 text-2xl sm:text-3xl md:text-4xl font-medium text-gray-600 italic">
                    Where Freshness Meets Convenience
                  </span>
                </h2>
                <p className="text-lg sm:text-xl opacity-90 leading-relaxed max-w-4xl text-gray-700">
                  "We bring you the freshest produce and quality groceries, delivered fast to your doorstep. Your one-stop shop for all your grocery needs."
                </p>
              </div>
              
              {/* Features grid without icons - clean and minimal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {aboutfeature.map((item, i) => (
                  <div key={i} className="flex flex-col space-y-2 p-5 bg-[#F9FFF6]/50 rounded-lg border border-[#8BC34A]/10 hover:border-[#8BC34A]/30 transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              
              {/* Buttons section */}
              <div className="flex flex-wrap gap-4 pt-6 justify-center">
                <button 
                  onClick={() => setShowAboutModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-[#8BC34A]/20 text-white text-lg"
                >
                  <FaInfoCircle className="animate-pulse text-xl" />
                  <span>Learn About Us</span>
                </button>
                
                <Link 
                  to="/menu" 
                  className="px-8 py-4 bg-gradient-to-r from-[#FF9807] to-[#FFC107] rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-[#FF9807]/20 text-white text-lg"
                >
                  <span>View Menu</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FloatingParticle/>

      {/* About Us Modal */}
      {showAboutModal && (
        <div 
          id="about-modal-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={closeModal}
        >
          <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#8BC34A]/30 shadow-2xl">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                  About <span className="text-[#8BC34A]">Us</span>
                </h2>
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="text-gray-800 hover:text-[#8BC34A] text-3xl font-bold transition-colors duration-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-10">
                {/* Shop Details */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#8BC34A]/30">Shop Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <svg className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">Business Name</h4>
                          <p className="text-gray-600 text-lg">Lakeshore Convenience Sylvan</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <svg className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">Address</h4>
                          <p className="text-gray-600 text-lg">5227 Lakeshore Dr Unit #105, Sylvan Lake, AB T4S 1Y8, Canada</p>
                          <a 
                            href="https://www.google.com/maps/search/?api=1&query=5227+Lakeshore+Dr+Unit+%23105%2C+Sylvan+Lake%2C+AB+T4S+1Y8%2C+Canada" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#8BC34A] hover:text-[#FFC107] transition-colors duration-300 inline-block mt-2"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <svg className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">Contact</h4>
                          <p className="text-gray-600 text-lg">Phone: (825) 205-5115</p>
                          <p className="text-gray-600 text-lg">Email: 2424200lakeshore@gmail.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <svg className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">Corporate Information</h4>
                          <p className="text-gray-600 text-lg">CIN No: U74120MH2014PLC259234</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <svg className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">Nearby Landmarks</h4>
                          <p className="text-gray-600 text-lg">Opposite the boathouse in Sylvan Lake</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50/90 backdrop-blur-lg rounded-2xl p-6 border border-[#8BC34A]/30">
                      <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">Services & Offerings</h4>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <span className="text-[#8BC34A] mr-2 mt-1">•</span>
                          <span className="text-gray-600 text-lg">Convenience store with a variety of snacks, drinks, and essentials</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#8BC34A] mr-2 mt-1">•</span>
                          <span className="text-gray-600 text-lg">Milkshakes with a variety of flavors</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#8BC34A] mr-2 mt-1">•</span>
                          <span className="text-gray-600 text-lg">Soda floats and unique drink options</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#8BC34A] mr-2 mt-1">•</span>
                          <span className="text-gray-600 text-lg">Fishing supplies, including leeches</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#8BC34A] mr-2 mt-1">•</span>
                          <span className="text-gray-600 text-lg">Exotic candies and snacks</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Features / Highlights */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#8BC34A]/30">Features & Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {aboutfeature.map((item, i) => (
                      <div key={i} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-[#8BC34A]/30 hover:border-[#8BC34A] transition-all duration-300">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.color.replace('from-\\[\\#4CAF50\\]', 'from-[#8BC34A]').replace('to-\\[\\#388E3C\\]', 'to-[#7CB342]').replace('from-\\[\\#F4D03F\\]', 'from-[#FFC107]').replace('to-\\[\\#E74C3C\\]', 'to-[#FF9807]')}`}>
                          <item.icon className="text-white text-xl" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-xl font-bold hover:scale-[1.02] transition-transform duration-300 text-lg text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutHome;