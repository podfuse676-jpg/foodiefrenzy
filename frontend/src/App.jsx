import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import OrderDetailPage from './pages/OrderDetail/OrderDetail';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import EmailLogin from './pages/EmailLogin/EmailLogin';
import WhatsAppLogin from './components/WhatsAppLogin'; // Import WhatsApp login component
import TestMenu from './TestMenu';
import Profile from './pages/Profile/Profile';
import SetCredentials from './components/SetCredentials/SetCredentials';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<WhatsAppLogin />} /> {/* Changed to WhatsApp login */}
      <Route path="/phone-login" element={<PhoneLogin />} />
      <Route path="/email-login" element={<EmailLogin />} /> {/* Moved email login to separate route */}
      <Route path="/whatsapp-login" element={<WhatsAppLogin />} /> {/* Added WhatsApp login route */}
      <Route path="/set-credentials" element={<SetCredentials />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/item/:id" element={<ProductDetail />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/test-menu" element={<TestMenu />} />

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
      
      {/* Order detail page */}
      <Route
        path="/myorder/:id"
        element={<PrivateRoute><OrderDetailPage /></PrivateRoute>}
      />
      
      {/* Profile page */}
      <Route
        path="/profile"
        element={<PrivateRoute><Profile /></PrivateRoute>}
      />
    </Routes>
  );
}

export default App;