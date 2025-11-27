import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import OrderDetailComponent from '../../components/OrderDetail/OrderDetail';
import Footer from '../../components/Footer/Footer';
import { Helmet } from 'react-helmet-async';

const OrderDetailPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Details - Lakeshore Convenience Grocery Delivery</title>
        <meta name="description" content="View detailed information about your grocery order with Lakeshore Convenience. Track order status, items, and delivery information." />
        <meta name="keywords" content="order details, grocery order, order tracking, Lakeshore Convenience" />
        <meta property="og:title" content="Order Details - Lakeshore Convenience Grocery Delivery" />
        <meta property="og:description" content="View detailed information about your grocery order with Lakeshore Convenience. Track order status, items, and delivery information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lakeshoreconvenience.com/order-detail" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Order Details - Lakeshore Convenience Grocery Delivery" />
        <meta name="twitter:description" content="View detailed information about your grocery order with Lakeshore Convenience. Track order status, items, and delivery information." />
        <link rel="canonical" href="https://lakeshoreconvenience.com/order-detail" />
      </Helmet>
      <Navbar />
      <OrderDetailComponent />
      <Footer />
    </>
  );
};

export default OrderDetailPage;