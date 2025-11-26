import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

// Completely disable service workers and clear all caches
(async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Get all registrations and unregister them
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Unregistered service worker');
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (let cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('Deleted cache:', cacheName);
        }
      }
      
      // Clear browser storage that might be causing issues
      localStorage.clear();
      sessionStorage.clear();
      
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
})();

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