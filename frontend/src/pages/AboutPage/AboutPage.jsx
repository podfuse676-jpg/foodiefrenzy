import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaIdCard } from 'react-icons/fa';
import Footer from '../../components/Footer/Footer';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800">
              About <span className="text-[#8BC34A]">Us</span>
            </h1>
            <div className="w-24 h-1 bg-[#8BC34A] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#8BC34A]/20">
            <div className="p-6 sm:p-8 md:p-12">
              {/* Shop Details */}
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-[#8BC34A]/30">
                  Shop Details
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <FaBuilding className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Business Name</h3>
                        <p className="text-gray-600 text-lg">Lakeshore Convenience Sylvan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <FaMapMarkerAlt className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Address</h3>
                        <p className="text-gray-600 text-lg">5227 Lakeshore Dr Unit #105, Sylvan Lake, AB T4S 1Y8, Canada</p>
                        <a 
                          href="https://www.google.com/maps/search/?api=1&query=5227+Lakeshore+Dr+Unit+%23105%2C+Sylvan+Lake%2C+AB+T4S+1Y8%2C+Canada" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#8BC34A] hover:text-[#7CB342] transition-colors duration-300 inline-block mt-2"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <FaPhone className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Contact</h3>
                        <p className="text-gray-600 text-lg">Phone: (825) 205-5115</p>
                        <p className="text-gray-600 text-lg">Email: 2424200lakeshore@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <FaIdCard className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Corporate Information</h3>
                        <p className="text-gray-600 text-lg">CIN No: U74120MH2014PLC259234</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <FaMapMarkerAlt className="text-[#8BC34A] text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Nearby Landmarks</h3>
                        <p className="text-gray-600 text-lg">Opposite the boathouse in Sylvan Lake</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#8BC34A]/5 to-[#F9FFF6] rounded-2xl p-6 border border-[#8BC34A]/20">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Services & Offerings</h3>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;