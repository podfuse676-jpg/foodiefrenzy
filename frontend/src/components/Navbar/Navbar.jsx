import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiLogOut,
  FiKey,
  FiPackage,
  FiHelpCircle
} from 'react-icons/fi';
import { FaShoppingBasket, FaLeaf, FaCarrot, FaAppleAlt, FaUserFriends } from 'react-icons/fa';
// Fixed the import path for SVG in Vite
import LakeshoreLogo from '../../assets/lakeshore-logo.png';
import { useCart } from '../../CartContext/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const loginData = localStorage.getItem('loginData');
      const authToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!(loginData && authToken));
    };

    checkAuthStatus();
    
    // Add event listener for storage changes (in case another tab updates auth)
    window.addEventListener('storage', checkAuthStatus);
    
    // Also check auth status periodically
    // This helps catch cases where logout happens in another component
    const interval = setInterval(checkAuthStatus, 1000);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Products', href: '/menu', icon: <FaShoppingBasket /> }, // Only Products menu item
    { name: 'FAQ', href: '/faq', icon: <FiHelpCircle /> },
    { name: 'Contact', href: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [
      { name: 'My Orders', href: '/myorder', icon: <FiPackage /> }
    ] : [])
  ];

  const handleLoginClick = () => {
    // Navigate to the new email login page
    navigate('/login');
  };

  const handleLogout = () => {
    // Remove all auth-related items from localStorage
    localStorage.removeItem('loginData');
    localStorage.removeItem('authToken');
    // Remove old token key if it exists
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update authentication state
    setIsAuthenticated(false);
    
    // If we're on a protected page, redirect to home
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img 
                  src={LakeshoreLogo} 
                  alt="Lakeshore Convenience Logo" 
                  className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3 object-contain"
                />
                <Link 
                  to="/" 
                  className="font-semibold text-xl sm:text-2xl text-[#4CAF50] hover:text-[#388E3C] transition-colors duration-300"
                >
                  Lakeshore Convenience
                </Link>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-4">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
              >
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                    location.pathname === '/' 
                      ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                      : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
              >
                <Link 
                  to="/menu" 
                  className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                    location.pathname === '/menu' || location.pathname.startsWith('/item/')
                      ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                      : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                  }`}
                >
                  Menu
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
              >
                <Link 
                  to="/faq" 
                  className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                    location.pathname === '/faq' 
                      ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                      : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                  }`}
                >
                  FAQ
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
              >
                <Link 
                  to="/about" 
                  className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                    location.pathname === '/about' 
                      ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                      : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 } 
                }}
              >
                <Link 
                  to="/contact" 
                  className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                    location.pathname === '/contact' 
                      ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                      : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                  }`}
                >
                  Contact
                </Link>
              </motion.div>
              {/* Add My Orders link for authenticated users */}
              {isAuthenticated && (
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 } 
                  }}
                >
                  <Link 
                    to="/myorder" 
                    className={`px-3 py-2 rounded-md text-sm font-cinzel transition-colors duration-300 ${
                      location.pathname === '/myorder' 
                        ? 'bg-[#4CAF50]/20 text-[#333333] font-bold' 
                        : 'text-gray-700 hover:bg-[#4CAF50]/30 hover:text-gray-900'
                    }`}
                  >
                    My Orders
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Cart and Auth Buttons */}
            <div className="flex items-center">
              {/* Cart */}
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Link 
                  to="/cart" 
                  className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors btn-subtle-hover"
                >
                  <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 icon-smooth" />
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-[#FFC107] text-[#333333] text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500,
                        damping: 30
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <motion.button
                  onClick={handleLogout}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center btn-press-feedback"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#f3f4f6",
                    transition: { duration: 0.2 } 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut className="mr-1 sm:mr-2 text-sm sm:text-base icon-smooth" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleLoginClick}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center btn-press-feedback"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#f3f4f6",
                    transition: { duration: 0.2 } 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiKey className="mr-1 sm:mr-2 text-sm sm:text-base icon-smooth" />
                  <span className="hidden sm:inline">Login</span>
                </motion.button>
              )}

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-md text-[#4CAF50] hover:bg-[#4CAF50]/10 focus:outline-none btn-press-feedback"
                whileHover={{ 
                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.9 }}
              >
                {isOpen ? (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 icon-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 icon-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            className="md:hidden animate-fade-in-down"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#8BC34A]/90 backdrop-blur-sm">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium flex items-center btn-subtle-hover ${
                      location.pathname === link.href
                        ? 'bg-white text-[#8BC34A]'
                        : 'text-gray-800 hover:bg-white/20'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-2 icon-smooth">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </nav>


    </>
  );
};

export default Navbar;