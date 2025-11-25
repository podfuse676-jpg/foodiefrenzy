import React from 'react';
import SEO from '../../components/SEO/SEO';
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
            <SEO 
                title="Online Grocery Menu - Lakeshore Convenience, Nationwide Delivery Across Canada"
                description="Browse our full grocery menu online. Fresh produce, quality groceries, convenience items, and specialty products available for delivery across Canada."
                keywords="online grocery menu, grocery delivery menu, Canada grocery, nationwide grocery shopping, fresh produce menu"
                ogTitle="Online Grocery Menu - Lakeshore Convenience, Nationwide Delivery Across Canada"
                ogDescription="Browse our full grocery menu online. Fresh produce, quality groceries, convenience items, and specialty products available for delivery across Canada."
                ogUrl="https://lakeshoreconvenience.com/menu"
                canonicalUrl="https://lakeshoreconvenience.com/menu"
            />
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