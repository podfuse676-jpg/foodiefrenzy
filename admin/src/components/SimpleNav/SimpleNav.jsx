import React from 'react';
import { NavLink } from 'react-router-dom';

const SimpleNav = () => {
  return (
    <nav className="p-4 bg-gray-700 text-white">
      <ul className="flex space-x-4">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "text-green-400 font-bold" : "text-gray-300"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              isActive ? "text-green-400 font-bold" : "text-gray-300"
            }
          >
            Users
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/test-users" 
            className={({ isActive }) => 
              isActive ? "text-green-400 font-bold" : "text-gray-300"
            }
          >
            Test Users
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SimpleNav;