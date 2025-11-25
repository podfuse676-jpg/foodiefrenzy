import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useLoading } from './LoadingContext/LoadingContext';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import SignUp from './components/SignUp/SignUp';
import ContactPage from './pages/ContactPage/ContactPage';
import CheckoutPage from './pages/Checkout/Checkout';
import AboutPage from './pages/AboutPage/AboutPage';
import Menu from './pages/Menu/Menu';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PhoneLogin from './components/PhoneLogin';
import MyOrders from './pages/MyOredrs/MyOrders';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import Login from './components/Login/Login';

// Configure NProgress
NProgress.configure({ 
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

function App() {
  const location = useLocation();
  const { startLoading, completeLoading } = useLoading();

  // Handle route changes with loading indicator
  useEffect(() => {
    // Start progress bar on route change
    startLoading();
    
    // Simulate a small delay to show the progress bar
    const timer = setTimeout(() => {
      completeLoading();
    }, 300);

    // Cleanup timer
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location, startLoading, completeLoading]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/phone-login" element={<PhoneLogin />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/item/:id" element={<ProductDetail />} />

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] p-4 w-full overflow-x-hidden">
      <div className="w-full max-w-md">
        <Login onLoginSuccess={handleLoginSuccess} onClose={handleClose} />
      </div>
    </div>
  );
};

export default App;