import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext/CartContext'
import { LoadingProvider } from './LoadingContext/LoadingContext'

createRoot(document.getElementById('root')).render(
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
)