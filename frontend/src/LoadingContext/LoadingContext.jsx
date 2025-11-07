import React, { createContext, useContext, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Create the context
const LoadingContext = createContext();

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Start loading
  const startLoading = (message = '') => {
    setLoading(true);
    setLoadingMessage(message);
    NProgress.start();
  };

  // Complete loading
  const completeLoading = () => {
    setLoading(false);
    setLoadingMessage('');
    NProgress.done();
  };

  // Configure NProgress
  NProgress.configure({ 
    minimum: 0.1,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
  });

  return (
    <LoadingContext.Provider value={{ 
      loading, 
      loadingMessage, 
      startLoading, 
      completeLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;