import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import SpecialOffer from '../../components/SpecialOffer/SpecialOffer';
import AboutHome from '../../components/AboutHome/AboutHome';
import Footer from '../../components/Footer/Footer';

const Home = () => {
    // Intersection Observers for scroll animations
    const [bannerRef, bannerInView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });
    
    const [specialOfferRef, specialOfferInView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });
    
    const [aboutRef, aboutInView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    return (
        <>
            <Helmet>
                <title>Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta</title>
                <meta name="description" content="Shop fresh groceries and convenience items online from Lakeshore Convenience in Sylvan Lake, Alberta. Fast delivery to your door. Fresh produce, quality groceries, and unique items available." />
                <meta name="keywords" content="grocery delivery Sylvan Lake, Alberta convenience store, online grocery shopping Canada, fresh produce delivery, food delivery Alberta" />
                <meta property="og:title" content="Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta" />
                <meta property="og:description" content="Shop fresh groceries and convenience items online from Lakeshore Convenience in Sylvan Lake, Alberta. Fast delivery to your door." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://lakeshoreconvenience.com" />
                <meta property="og:locale" content="en_CA" />
                <meta name="twitter:title" content="Lakeshore Convenience - Fresh Grocery Delivery in Sylvan Lake, Alberta" />
                <meta name="twitter:description" content="Shop fresh groceries and convenience items online from Lakeshore Convenience in Sylvan Lake, Alberta. Fast delivery to your door." />
                <link rel="canonical" href="https://lakeshoreconvenience.com" />
            </Helmet>
            <Navbar />
            <div 
                ref={bannerRef}
                className={`transition-all duration-700 ${bannerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <Banner />
            </div>
            <div 
                ref={specialOfferRef}
                className={`transition-all duration-700 delay-100 ${specialOfferInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <SpecialOffer />
            </div>
            <div 
                ref={aboutRef}
                className={`transition-all duration-700 delay-200 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <AboutHome />
            </div>
            <Footer />
        </>
    )
}

export default Home;