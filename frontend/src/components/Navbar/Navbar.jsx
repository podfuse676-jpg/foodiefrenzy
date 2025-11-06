import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
      <nav className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - improved for mobile */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-white p-1 rounded-full">
                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-contain" src={LakeshoreLogo} alt="Lakeshore Convenience" />
              </div>
              <span className="ml-2 sm:ml-3 text-base sm:text-xl font-bold font-serif text-white hidden sm:block">Lakeshore Convenience</span>
            </div>

            {/* Desktop Navigation - improved for mobile */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors ${
                        isActive
                          ? 'bg-white text-[#8BC34A]'
                          : 'text-white hover:bg-white/20'
                      }`
                    }
                  >
                    <span className="mr-1 sm:mr-2 text-sm sm:text-base">{link.icon}</span>
                    <span className="hidden lg:inline">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Cart and Auth Buttons - improved for mobile */}
            <div className="flex items-center">
              {/* Cart */}
              <NavLink to="/cart" className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors">
                <FiShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFC107] text-[#333333] text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>

              {/* Auth Buttons - improved for mobile */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-1 sm:mr-2 text-sm sm:text-base" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="ml-2 sm:ml-4 px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-white text-[#8BC34A] hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FiKey className="mr-1 sm:mr-2 text-sm sm:text-base" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-md text-white hover:bg-white/20 focus:outline-none"
              >
                {isOpen ? (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - improved for mobile */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#8BC34A]/90 backdrop-blur-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      isActive
                        ? 'bg-white text-[#8BC34A]'
                        : 'text-white hover:bg-white/20'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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