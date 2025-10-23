import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import apiConfig from '../utils/apiConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = apiConfig.baseURL;

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      const role = localStorage.getItem('adminRole');
      
      if (token && role === 'admin') {
        try {
          // Verify token with backend
          await axios.get(`${url}/api/users/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsAuthenticated(true);
          setIsAdmin(true);
        } catch (error) {
          // Token is invalid, clear it
          console.log('Token verification failed:', error.response?.status, error.response?.data);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRole');
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [url]);

  const login = (token, role) => {
    if (role === 'admin') {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminRole', role);
      setIsAuthenticated(true);
      setIsAdmin(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};