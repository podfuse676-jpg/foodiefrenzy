import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Contact from "../../components/Contact/Contact"
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Lakeshore Convenience - Grocery Delivery in Sylvan Lake, Alberta</title>
        <meta name="description" content="Contact Lakeshore Convenience in Sylvan Lake, Alberta for grocery delivery inquiries, customer service, or special orders. We're here to help with all your grocery needs." />
        <meta name="keywords" content="contact grocery store, Sylvan Lake grocery delivery, Alberta grocery service, Lakeshore Convenience contact" />
        <meta property="og:title" content="Contact Lakeshore Convenience - Grocery Delivery in Sylvan Lake, Alberta" />
        <meta property="og:description" content="Contact Lakeshore Convenience in Sylvan Lake, Alberta for grocery delivery inquiries, customer service, or special orders. We're here to help with all your grocery needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lakeshoreconvenience.com/contact" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:title" content="Contact Lakeshore Convenience - Grocery Delivery in Sylvan Lake, Alberta" />
        <meta name="twitter:description" content="Contact Lakeshore Convenience in Sylvan Lake, Alberta for grocery delivery inquiries, customer service, or special orders." />
        <link rel="canonical" href="https://lakeshoreconvenience.com/contact" />
      </Helmet>
      <Navbar />
      <Contact />
      <Footer />
    </>
  )
}

export default ContactPage