import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiUsers, FiPlusCircle, FiList, FiPackage } from 'react-icons/fi';
import { navLinks } from '../../assets/dummyadmin';

const TestNav = () => {
  const navigate = useNavigate();
  
  // Debug: Log navLinks
  console.log('TestNav navLinks:', navLinks);
  
  const testLinks = [
    { name: 'Add Items', href: '/', icon: <FiPlusCircle /> },
    { name: 'List Items', href: '/list', icon: <FiList /> },
    { name: 'Orders', href: '/orders', icon: <FiPackage /> },
    { name: 'Users', href: '/users', icon: <FiUsers /> },
  ];

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2>Test Navigation</h2>
      <div className="mb-4">
        <h3>Direct Navigation Buttons:</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/users')} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Users
          </button>
        </div>
      </div>
      
      <nav>
        <h3>NavLink Components:</h3>
        <ul className="space-y-2">
          {testLinks.map(link => (
            <li key={link.name}>
              <NavLink 
                to={link.href} 
                className={({ isActive }) => 
                  isActive ? "text-green-400 font-bold" : "text-gray-300"
                }
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-4">
        <h3>Imported navLinks:</h3>
        <ul className="space-y-2">
          {navLinks.map(link => (
            <li key={link.name}>
              <NavLink 
                to={link.href} 
                className={({ isActive }) => 
                  isActive ? "text-green-400 font-bold" : "text-gray-300"
                }
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestNav;