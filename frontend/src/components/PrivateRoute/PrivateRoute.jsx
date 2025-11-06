import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check for authentication using consistent token key
    const token = localStorage.getItem('authToken');
    const loginData = localStorage.getItem('loginData');
    const isAuthenticated = Boolean(token) && Boolean(loginData) && token !== 'undefined' && token !== 'null';
    
    // Clear invalid tokens
    if (!isAuthenticated && (token === 'undefined' || token === 'null' || token === '')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('loginData');
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;