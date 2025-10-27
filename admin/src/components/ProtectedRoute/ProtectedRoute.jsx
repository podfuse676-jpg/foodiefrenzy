import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2c1a] via-[#2a422a] to-[#0f1c0f] flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    console.log('Redirecting to login - not authenticated or not admin');
    return <Navigate to="/login" replace />;
  }

  // If authenticated and is admin, render children
  console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;