import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Simple error handler
window.addEventListener('error', (e) => {
  console.error('Global error caught:', e.error);
});

const container = document.getElementById('root');
const root = createRoot(container);

// Minimal app without providers to test if they're causing issues
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)