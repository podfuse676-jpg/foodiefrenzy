import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Simple test to see if the app is mounting
const container = document.getElementById('root');
const root = createRoot(container);

// Test if the root element exists
if (container) {
  console.log('Root element found');
  
  // Simple test component
  const TestApp = () => {
    return (
      <div>
        <h1>Lakeshore Convenience Test</h1>
        <p>If you can see this, the app is mounting correctly.</p>
      </div>
    );
  };

  root.render(<TestApp />);
  
  console.log('App rendered');
} else {
  console.error('Root element not found');
}