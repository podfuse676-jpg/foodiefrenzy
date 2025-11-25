import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiLogOut,
  FiKey,
  FiPackage
} from 'react-icons/fi';
import { FaShoppingBasket, FaLeaf, FaCarrot, FaAppleAlt, FaUserFriends } from 'react-icons/fa';
// Fixed the import path for SVG in Vite
import LakeshoreLogo from '../../assets/lakeshore-logo.png';
import Login from '../Login/Login';
import { useCart } from '../../CartContext/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check authentication status on component mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const loginData = localStorage.getItem('loginData');
      const authToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!(loginData && authToken));
    };

    checkAuthStatus();
    
    // Also check when location changes
    setShowLoginModal(location.pathname === '/login');
    
    // Add event listener for storage changes (in case another tab updates auth)
    window.addEventListener('storage', checkAuthStatus);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Products', href: '/menu', icon: <FaShoppingBasket /> }, // Only Products menu item
    { name: 'Contact', href: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [
      { name: 'My Orders', href: '/myorder', icon: <FiPackage /> }
    ] : [])
  ];

  const handleLoginSuccess = () => {
    // Update authentication state
    setIsAuthenticated(true);
    // Close modal
    setShowLoginModal(false);
    // Navigate to home
    navigate('/');
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
              <Link 
                to="/" 
                className="font-dancingscript text-2xl sm:text-3xl text-[#4CAF50] hover:text-[#388E3C] transition-colors duration-300"
              >
                Lakeshore Convenience
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-4">
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
            </div>

            {/* Cart and Auth Buttons */}
            <div className="flex items-center">
              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors btn-subtle-hover"
              >
                <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 icon-smooth" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFC107] text-[#333333] text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center btn-press-feedback"
                >
                  <FiLogOut className="mr-1 sm:mr-2 text-sm sm:text-base icon-smooth" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center btn-press-feedback"
                >
                  <FiKey className="mr-1 sm:mr-2 text-sm sm:text-base icon-smooth" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-md text-white hover:bg-white/20 focus:outline-none btn-press-feedback"
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
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#8BC34A]/90 backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium flex items-center btn-subtle-hover ${
                    location.pathname === link.href
                      ? 'bg-white text-[#8BC34A]'
                      : 'text-white hover:bg-white/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2 icon-smooth">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay open">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto modal-content open">
            <div className="p-1 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-lg">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;