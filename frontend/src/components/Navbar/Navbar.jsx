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
    { name: 'Grocery', href: '/menu', icon: <FaShoppingBasket /> },
    { name: 'About', href: '/about', icon: <FiStar /> },
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
    if (location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname === '/myorder') {
      navigate('/');
    }
    
    // Show logout success message
    // You might want to add a toast notification here
  };

  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-[#FAFAFA] 
          rounded-2xl font-bold hover:shadow-lg hover:shadow-[#4CAF50]/40 transition-all 
          border-2 border-[#4CAF50]/20 flex items-center space-x-2 shadow-md shadow-[#333333]/20 text-sm"
      >
        <FiLogOut className="text-base lg:text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-[#FAFAFA] 
          rounded-2xl font-bold hover:shadow-lg hover:shadow-[#4CAF50]/40 transition-all 
          border-2 border-[#4CAF50]/20 flex items-center space-x-2 shadow-md shadow-[#333333]/20 text-sm"
      >
        <FiKey className="text-base lg:text-lg" />
        <span>Login</span>
      </button>
    );
  };

  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-[#FAFAFA] rounded-xl font-semibold flex items-center justify-center space-x-2"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => {
          navigate('/login');
          setIsOpen(false);
        }}
        className="w-full px-4 py-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-[#FAFAFA] rounded-xl font-semibold flex items-center justify-center space-x-2"
      >
        <FiKey className="text-lg" />
        <span>Login</span>
      </button>
    );
  };

  return (
    <nav className="bg-[#333333] border-b-8 border-[#4CAF50]/40 shadow-[0_25px_50px_-12px] shadow-[#4CAF50]/30 sticky top-0 z-50 font-vibes">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-[#4CAF50]/50 to-transparent shadow-[0_0_20px] shadow-[#4CAF50]/30"></div>
        <div className="flex justify-between px-6">
          {/* Replace fork icons with grocery-related icons */}
          <svg className="text-[#4CAF50]/40 -mt-4 -ml-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
          </svg>
          <svg className="text-[#4CAF50]/40 -mt-4 -mr-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center space-x-3 group">
            {/* Logo in a circle with matching border - 90% zoom */}
            <div className="rounded-full border-2 border-[#4CAF50] p-1 bg-[#FAFAFA]">
              <img src={LakeshoreLogo} alt="Lakeshore Convenience" className="h-12 w-12 rounded-full object-contain scale-90" />
            </div>
            <div className="flex flex-col ml-1 md:ml-2">
              <NavLink
                to="/"
                className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#F4D03F] bg-clip-text text-transparent whitespace-nowrap"
              >
                Lakeshore Convenience
              </NavLink>
              <div className="h-[3px] bg-gradient-to-r from-[#4CAF50]/30 via-[#F4D03F]/50 to-[#4CAF50]/30 w-full mt-1" />
            </div>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-2 xl:px-4 py-2 flex items-center space-x-2 rounded-3xl border-2 transition-colors text-sm xl:text-base
                  ${isActive ? 'bg-[#4CAF50]/20 border-[#4CAF50]/50' : 'border-transparent hover:border-[#4CAF50]/50'}`
                }
              >
                <span className="text-[#4CAF50]">{link.icon}</span>
                <span className="text-[#FAFAFA]">{link.name}</span>
              </NavLink>
            ))}
            <div className="flex items-center space-x-2 xl:space-x-4 ml-2 xl:ml-4">
              <NavLink
                to="/cart"
                className="p-2 relative text-[#FAFAFA] hover:text-[#F4D03F] transition-colors"
              >
                <FiShoppingCart className="text-lg xl:text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E74C3C] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              {renderDesktopAuthButton()}
            </div>
          </div>
          
          {/* Hamburger Menu Button - Visible on mobile */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#4CAF50] hover:text-[#F4D03F] p-2 rounded-xl border-2 border-[#333333]/30 transition-colors"
            >
              <div className="space-y-2">
                <span className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#333333] border-t-4 border-[#4CAF50]/40">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl ${
                    isActive ? 'bg-[#4CAF50]/30 text-[#F4D03F]' : 'text-[#FAFAFA] hover:bg-[#4CAF50]/20'
                  }`
                }
              >
                <span className="text-[#4CAF50]">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
            <div className="pt-4 border-t border-[#4CAF50]/40 space-y-3">
              <NavLink
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-[#FAFAFA] hover:bg-[#4CAF50]/20 rounded-xl"
              >
                <FiShoppingCart />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="bg-[#E74C3C] text-xs px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              {renderMobileAuthButton()}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#333333] to-[#4a4a4a] rounded-xl p-8 w-full max-w-md relative border-4 border-[#4CAF50]/30">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 text-[#4CAF50] hover:text-[#F4D03F] text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#F4D03F] bg-clip-text text-transparent mb-6 text-center">
              Lakeshore Convenience
            </h2>
            <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;