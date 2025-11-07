import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CartPage from '../../components/CartPage/CartPage';
import { Helmet } from 'react-helmet-async';
import { useLoading } from '../../LoadingContext/LoadingContext';

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { startLoading, completeLoading } = useLoading();
  
  // Intersection Observer for scroll animations
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    // Simulate loading for demonstration
    startLoading('Loading your cart...');
    const timer = setTimeout(() => {
      setLoading(false);
      completeLoading();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [startLoading, completeLoading]);

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart - Lakeshore Convenience Grocery Delivery</title>
        <meta name="description" content="Review and manage your grocery shopping cart from Lakeshore Convenience. Fresh produce, quality groceries, and convenience items ready for checkout and delivery to your door in Sylvan Lake, Alberta." />
        <meta name="keywords" content="grocery shopping cart, online grocery cart, Sylvan Lake grocery delivery, Alberta grocery checkout" />
        <meta property="og:title" content="Your Shopping Cart - Lakeshore Convenience Grocery Delivery" />
        <meta property="og:description" content="Review and manage your grocery shopping cart from Lakeshore Convenience. Fresh produce, quality groceries, and convenience items ready for checkout and delivery to your door in Sylvan Lake, Alberta." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lakeshoreconvenience.com/cart" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Your Shopping Cart - Lakeshore Convenience Grocery Delivery" />
        <meta name="twitter:description" content="Review and manage your grocery shopping cart from Lakeshore Convenience. Fresh produce, quality groceries, and convenience items ready for checkout." />
        <link rel="canonical" href="https://lakeshoreconvenience.com/cart" />
      </Helmet>
      <Navbar />
      <div 
        ref={ref}
        className={`transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-90'}`}
      >
        <CartPage />
      </div>
      <Footer />
    </>
  )
}

export default Cart;