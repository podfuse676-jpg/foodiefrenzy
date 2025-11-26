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
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import EmailLogin from './pages/EmailLogin/EmailLogin';

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>We're working on fixing the issue. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<EmailLogin />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/item/:id" element={<ProductDetail />} />
        <Route path="/faq" element={<FAQ />} />

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
    </ErrorBoundary>
  );
}

export default App;