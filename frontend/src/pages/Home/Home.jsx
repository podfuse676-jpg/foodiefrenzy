import React from 'react';
import SEO from '../../components/SEO/SEO';
import { OrganizationStructuredData, WebsiteStructuredData } from '../../components/SEO/StructuredData';
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
            <SEO 
                title="Lakeshore Convenience - Nationwide Grocery Delivery Across Canada" 
                description="Imported candies, refreshing drinks, and everyday essentials delivered quickly and conveniently."
                keywords="grocery delivery, convenience store, Canada, fresh produce, quality groceries, online shopping, food delivery, nationwide delivery"
                ogTitle="Lakeshore Convenience - Nationwide Grocery Delivery Across Canada"
                ogDescription="Imported candies, refreshing drinks, and everyday essentials delivered quickly and conveniently."
                ogImage={`${window.location.origin}/og-image.jpg`}
            />
            <OrganizationStructuredData />
            <WebsiteStructuredData />
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