// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddItems from './components/AddItems/AddItems';
import Orders from './components/Orders/Orders';
import ListItems from './components/ListItems/ListItems';
import AdminLogin from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminNavbar from './components/Navbar/Navbar';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <AdminNavbar />
              <AddItems />
            </>
          </ProtectedRoute>
        } />
        <Route path="/list" element={
          <ProtectedRoute>
            <>
              <AdminNavbar />
              <ListItems />
            </>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <>
              <AdminNavbar />
              <Orders />
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;