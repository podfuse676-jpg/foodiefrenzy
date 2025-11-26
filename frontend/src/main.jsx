import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

// Comprehensive service worker cleanup
const cleanupServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Unregistered service worker:', registration.scope);
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (let cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('Deleted cache:', cacheName);
        }
      }
      
      // Reload the page to ensure fresh content
      window.location.reload();
    } catch (error) {
      console.error('Error cleaning up service workers:', error);
    }
  }
};

// Run cleanup immediately
cleanupServiceWorkers();

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