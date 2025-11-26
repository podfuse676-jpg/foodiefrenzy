import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

// Aggressive service worker cleanup on app start
const aggressiveCleanup = async () => {
  try {
    // Clean up service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Unregistered service worker:', registration.scope);
      }
    }
    
    // Clean up all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (let cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('Deleted cache:', cacheName);
      }
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log('Aggressive cleanup completed');
  } catch (error) {
    console.error('Error during aggressive cleanup:', error);
  }
};

// Run cleanup immediately
aggressiveCleanup();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <LoadingProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LoadingProvider>
    </BrowserRouter>
  </HelmetProvider>
)