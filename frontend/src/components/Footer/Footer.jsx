import React, { useState } from 'react';
import { FaRegEnvelope } from 'react-icons/fa6';
import { BiChevronRight } from 'react-icons/bi';
// Import the logo
import LakeshoreLogo from '../../assets/lakeshore-logo.png';
import { socialIcons } from '../../assets/dummydata';

const navItems = [
  { name: 'Home', link: '/' },
  { name: 'Menu', link: '/menu' },
  { name: 'About Us', link: '/about' },
  { name: 'Contact', link: '/contact' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    setEmail('');
  };

  return (
    // Updated to light fresh colors
    <footer className="bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* Circular logo with zoomed image - 90% zoom */}
              <div className="rounded-full border-2 border-[#8BC34A] p-1.5 bg-white">
                <img src={LakeshoreLogo} alt="Lakeshore Convenience" className="h-14 w-14 rounded-full object-contain scale-90" />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold font-sacramento text-[#8BC34A] animate-pulse">
                Lakeshore Convenience
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-sacramento italic">
              Your trusted grocery partner.<br />
              Fresh produce and quality goods delivered to your door.
            </p>
            <form onSubmit={handleSubmit} className="relative mt-4 group">
              <div className="flex items-center gap-2 mb-2">
                <FaRegEnvelope className="text-[#8BC34A] animate-pulse" />
                <span className="font-bold text-[#8BC34A]">Get Exclusive Offers</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white border-2 border-[#8BC34A]/30 focus:outline-none focus:border-[#8BC34A] focus:ring-4 focus:ring-[#8BC34A]/20 transition-all duration-300 placeholder-gray-500 pr-24"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#8BC34A] text-white px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:shadow-[#8BC34A]/30 overflow-hidden transition-all duration-500"
                >
                  <span className="font-bold text-sm tracking-wide transition-transform duration-300 group-hover:-translate-x-1">
                    Join Now
                  </span>
                  <BiChevronRight className="text-xl transition-transform duration-300 group-hover:animate-spin flex-shrink-0" />
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
              </div>
            </form>
          </div>

          {/* Middle Column */}
          <div className="flex justify-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-l-4 border-[#8BC34A] pl-3 font-merriweather italic text-[#8BC34A]">
                Navigation
              </h3>
              <ul className="space-y-3">
                {navItems.map(item => (
                  <li key={item.name}>
                    <a href={item.link} className="flex items-center hover:text-[#8BC34A] transition-all group font-lora hover:pl-2">
                      <BiChevronRight className="mr-2 text-[#8BC34A] group-hover:animate-bounce" />
                      <span className="hover:italic">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-center md:justify-end">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-l-4 border-[#8BC34A] pl-3 font-merriweather italic text-[#8BC34A]">
                Social Connect
              </h3>
              <div className="flex space-x-4">
                {socialIcons.map(({ icon: Icon, link, color, label }, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl bg-[#8BC34A]/10 p-3 rounded-full hover:bg-[#8BC34A]/20 hover:scale-110 transition-all duration-300 relative group"
                    style={{ color }}
                  >
                    <Icon className="hover:scale-125 transition-transform" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#8BC34A] text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#8BC34A]/30 pt-8 mt-8 text-center">
          <p className="text-[#8BC34A] text-lg mb-2 font-playfair">
            © 2025 Lakeshore Convenience. All rights reserved.
          </p>
          <div className="group inline-block">
            <a
              href="https://hexagondigitalservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-sacramento bg-gradient-to-r from-[#8BC34A] via-[#7CB342] to-[#8BC34A] bg-clip-text text-transparent hover:text-[#FFC107] transition-all duration-500"
            >
              Designed by Yapa Digital Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;