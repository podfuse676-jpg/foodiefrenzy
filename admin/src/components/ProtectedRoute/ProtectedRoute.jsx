import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Debugging information
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated and is admin, render children
  console.log('ProtectedRoute - Rendering children');
  return children;
};

export default ProtectedRoute;