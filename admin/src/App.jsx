// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminNavbar from './components/Navbar/Navbar';

// Minimal dashboard component
const Dashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-amber-100">Dashboard</h1>
    <p className="text-amber-200">This is the main dashboard content</p>
  </div>
);

// Main layout component for authenticated routes
const DashboardLayout = () => (
  <div>
    <AdminNavbar />
    <div className="pt-20">
      <Dashboard />
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
            <DashboardLayout />
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;