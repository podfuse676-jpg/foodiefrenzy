import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/Navbar/Navbar';
import OurMenu from '../../components/OurMenu/OurMenu';
import Footer from '../../components/Footer/Footer';

const Menu = () => {
    // Intersection Observer for scroll animations
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    return (
        <>
            <Helmet>
                <title>Online Grocery Menu - Lakeshore Convenience, Sylvan Lake, Alberta</title>
                <meta name="description" content="Browse our full grocery menu online. Fresh produce, quality groceries, convenience items, and specialty products available for delivery in Sylvan Lake, Alberta, Canada." />
                <meta name="keywords" content="online grocery menu, grocery delivery menu, Sylvan Lake grocery, Alberta grocery shopping, fresh produce menu" />
                <meta property="og:title" content="Online Grocery Menu - Lakeshore Convenience, Sylvan Lake, Alberta" />
                <meta property="og:description" content="Browse our full grocery menu online. Fresh produce, quality groceries, convenience items, and specialty products available for delivery in Sylvan Lake, Alberta, Canada." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://lakeshoreconvenience.com/menu" />
                <meta property="og:locale" content="en_CA" />
                <meta name="twitter:title" content="Online Grocery Menu - Lakeshore Convenience, Sylvan Lake, Alberta" />
                <meta name="twitter:description" content="Browse our full grocery menu online. Fresh produce, quality groceries, convenience items, and specialty products available for delivery in Sylvan Lake, Alberta, Canada." />
                <link rel="canonical" href="https://lakeshoreconvenience.com/menu" />
            </Helmet>
            <Navbar />
            <div 
                ref={ref}
                className={`transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-90'}`}
            >
                <OurMenu />
            </div>
            <Footer />
        </>
    )
}

export default Menu;