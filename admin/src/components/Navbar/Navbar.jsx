// src/components/AdminNavbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut
} from 'react-icons/fi';
// Fixed the import path for SVG in Vite
import LakeshoreLogo from '../../assets/lakeshore-logo.png';
import { styles, navLinks } from '../../assets/dummyadmin';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          {/* Logo in a circle with matching border - 90% zoom */}
          <div className="rounded-full border-2 border-[#4ade80] p-1 bg-[#f0fdf4]">
            <img src={LakeshoreLogo} alt="Lakeshore Convenience" className="h-12 w-12 rounded-full object-contain scale-90" />
          </div>
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-[#1a2c1a]/30 text-green-100 hover:border-red-500 hover:bg-red-900/20 transition-all"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-[#1a2c1a]/30 text-green-100 hover:border-red-500 hover:bg-red-900/20 transition-all w-full"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;