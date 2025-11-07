import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import SignUp from './components/SignUp/SignUp';
import ContactPage from './pages/ContactPage/ContactPage';
import CheckoutPage from './pages/Checkout/Checkout';
import AboutPage from './pages/AboutPage/AboutPage';
import Menu from './pages/Menu/Menu';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PhoneLogin from './components/PhoneLogin';
import MyOrders from './pages/MyOredrs/MyOrders';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import Login from './components/Login/Login';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta</title>
        <meta name="description" content="Lakeshore Convenience - Your local grocery store in Sylvan Lake, Alberta. Fresh produce, quality groceries, and convenience items delivered fast to your door. Serving Canadian customers with the best selection and service." />
        <meta name="keywords" content="grocery delivery, convenience store, Sylvan Lake, Alberta, Canada, fresh produce, quality groceries, online shopping, food delivery" />
        <meta property="og:title" content="Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta" />
        <meta property="og:description" content="Fresh produce and quality groceries delivered fast. Your weekly shopping made easy and convenient. Serving Sylvan Lake and surrounding areas in Alberta, Canada." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lakeshoreconvenience.com" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta" />
        <meta name="twitter:description" content="Fresh produce and quality groceries delivered fast. Your weekly shopping made easy and convenient." />
        <link rel="canonical" href="https://lakeshoreconvenience.com" />
      </Helmet>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/item/:id" element={<Menu />} />

        {/* Payment verification */}
        <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

        {/* Protected */}
        <Route
          path="/cart"
          element={<PrivateRoute><Cart /></PrivateRoute>}
        />
        <Route
          path="/checkout"
          element={<PrivateRoute><CheckoutPage /></PrivateRoute>}
        />

        {/* The actual orders list */}
        <Route
          path="/myorder"
          element={<PrivateRoute><MyOrders /></PrivateRoute>}
        />
      </Routes>
    </HelmetProvider>
  );
}

// Wrapper component to handle login success and close functionality for direct login route
const LoginWrapper = () => {
  const handleLoginSuccess = () => {
    // Redirect to home page after successful login
    window.location.href = '/';
  };

  const handleClose = () => {
    // Redirect to home page when closing
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] p-4">
      <div className="w-full max-w-md">
        <Login onLoginSuccess={handleLoginSuccess} onClose={handleClose} />
      </div>
    </div>
  );
};

export default App;