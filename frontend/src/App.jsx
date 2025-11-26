import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import FAQ from './pages/FAQ/FAQ';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PhoneLogin from './components/PhoneLogin';
import MyOrders from './pages/MyOredrs/MyOrders';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import EmailLogin from './pages/EmailLogin/EmailLogin';

// Configure NProgress
NProgress.configure({ 
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

function App() {
  const location = useLocation();

  return (
    <div>
      <h1>Lakeshore Convenience</h1>
      <p>Welcome to our grocery store!</p>
    </div>
  );
}

export default App;