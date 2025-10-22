// src/components/AdminNavbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiMenu,
  FiX
} from 'react-icons/fi';
// Fixed the import path for SVG in Vite
import LakeshoreLogo from '../../assets/lakeshore-logo.png';
import { styles, navLinks } from '../../assets/dummyadmin';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          {/* Logo in a circle with matching border - 90% zoom */}
          <div className="rounded-full border-2 border-[#f59e0b] p-1 bg-[#fff7ed]">
            <img src={LakeshoreLogo} alt="Lakeshore Convenience" className="h-12 w-12 rounded-full object-contain scale-90" />
          </div>
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
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
        </div>
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
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
