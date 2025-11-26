import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

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