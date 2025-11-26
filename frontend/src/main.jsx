import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

// Simple error handler
window.addEventListener('error', (e) => {
  console.error('Global error caught:', e.error);
});

// Register service worker for caching and performance
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
    }}>
        <LoadingProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </LoadingProvider>
    </BrowserRouter>
  </HelmetProvider>
)