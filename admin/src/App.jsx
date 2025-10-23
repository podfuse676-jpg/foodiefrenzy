// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddItems from './components/AddItems/AddItems';
import Orders from './components/Orders/Orders';
import ListItems from './components/ListItems/ListItems';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminNavbar from './components/Navbar/Navbar';

// Main layout component that includes the navbar
const MainLayout = ({ children }) => (
  <div>
    <AdminNavbar />
    <div className="pt-20"> {/* Add padding to account for fixed navbar */}
      {children}
    </div>
  </div>
);

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <AddItems />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/list" element={
          <ProtectedRoute>
            <MainLayout>
              <ListItems />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;