// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddItems from './components/AddItems/AddItems';
import Orders from './components/Orders/Orders';
import ListItems from './components/ListItems/ListItems';
import Users from './components/Users/Users';
import SimpleNav from './components/SimpleNav/SimpleNav';
import TestImages from './components/TestImages/TestImages';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  // Debug information
  console.log('App component rendering');
  
  return (
    <div>
      {/* Simple navigation for testing */}
      <SimpleNav />
      <TestImages />
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
        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />
        {/* Debug route to test if routing is working */}
        <Route path="/test-users" element={
          <div className="p-4 bg-blue-100">
            <h1>Test Users Route</h1>
            <p>This is a test route to verify routing works.</p>
          </div>
        } />
        {/* Redirect any unknown routes to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;