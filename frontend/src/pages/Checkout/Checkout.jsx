import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import CheckoutMe from "../../components/Checkout/Checkout"
import { Helmet } from 'react-helmet-async';

const CheckoutPage = () => {
  return (
    <>
      <Helmet>
        <title>Checkout - Lakeshore Convenience Grocery Delivery</title>
        <meta name="description" content="Complete your grocery order with Lakeshore Convenience. Secure checkout for fresh produce, quality groceries, and convenience items delivered to your door in Sylvan Lake, Alberta, Canada." />
        <meta name="keywords" content="grocery checkout, online grocery payment, Sylvan Lake grocery delivery, Alberta grocery checkout" />
        <meta property="og:title" content="Checkout - Lakeshore Convenience Grocery Delivery" />
        <meta property="og:description" content="Complete your grocery order with Lakeshore Convenience. Secure checkout for fresh produce, quality groceries, and convenience items delivered to your door in Sylvan Lake, Alberta, Canada." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lakeshoreconvenience.com/checkout" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Checkout - Lakeshore Convenience Grocery Delivery" />
        <meta name="twitter:description" content="Complete your grocery order with Lakeshore Convenience. Secure checkout for fresh produce, quality groceries, and convenience items delivered to your door." />
        <link rel="canonical" href="https://lakeshoreconvenience.com/checkout" />
      </Helmet>
      <Navbar />
      <CheckoutMe />
      <Footer />
    </>
  )
}

export default CheckoutPage