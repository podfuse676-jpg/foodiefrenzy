// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddItems from './components/AddItems/AddItems';
import Orders from './components/Orders/Orders';
import ListItems from './components/ListItems/ListItems';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminNavbar from './components/Navbar/Navbar';

// Simple test component to debug the navbar issue
const TestComponent = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-amber-100">Test Component</h1>
    <p className="text-amber-200">This is a test component to check navbar duplication</p>
  </div>
);

// Layout component for authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <div>
    <AdminNavbar />
    <div className="pt-20">
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
            <AuthenticatedLayout>
              <TestComponent />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/list" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ListItems />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Orders />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;