// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddItems from './components/AddItems/AddItems';
import Orders from './components/Orders/Orders';
import ListItems from './components/ListItems/ListItems';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminNavbar from './components/Navbar/Navbar';

function App() {
  // Debug information
  console.log('App component rendering');
  
  return (
    <div>
      {/* Navbar is always visible except on login page */}
      <AdminNavbar />
      <div className="pt-20">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AddItems />
            </ProtectedRoute>
          } />
          <Route path="/list" element={
            <ProtectedRoute>
              <ListItems />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          {/* Redirect any unknown routes to the dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;