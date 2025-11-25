import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO/SEO';
import { OrganizationStructuredData } from '../../components/SEO/StructuredData';
import { FAQSchema } from '../../components/SEO/FAQSchema';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our menu, adding items to your cart, and proceeding to checkout. You'll need to create an account or log in to complete your purchase. We offer delivery across Canada with options for same-day delivery in many areas."
    },
    {
      question: "What are your delivery hours?",
      answer: "We offer delivery 7 days a week. Orders placed before 2 PM local time are typically delivered the same day. Delivery hours are 9 AM to 9 PM Monday through Sunday. For specific cutoff times in your area, please contact our customer service team."
    },
    {
      question: "Do you deliver to my area?",
      answer: "We proudly serve customers across all provinces and territories in Canada. Enter your postal code during checkout to confirm service availability in your area. If you're in a remote location, please contact us to discuss delivery options."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support Interac e-Transfer and cash on delivery for local customers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary by location. In major cities, you can expect delivery within 30-60 minutes. For suburban and rural areas, delivery typically takes 1-2 hours. You'll receive real-time updates on your order status and estimated delivery time."
    },
    {
      question: "What is your return policy?",
      answer: "We want you to be completely satisfied with your purchase. If you receive damaged or incorrect items, please contact us within 24 hours of delivery. We'll either replace the items or issue a full refund. For non-perishable items, returns are accepted within 7 days with original packaging."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order as long as it hasn't been prepared. Orders can be changed or canceled up to 30 minutes after placement through the 'My Orders' section of your account. Once an order is in preparation, modifications may not be possible."
    },
    {
      question: "Are your products fresh?",
      answer: "We guarantee the freshness of all our products. Our produce is sourced daily from local suppliers when possible, and all perishable items are delivered within their optimal freshness window. We inspect all products before delivery and will replace any items that don't meet our quality standards."
    },
    {
      question: "Do you offer contactless delivery?",
      answer: "Yes, we offer completely contactless delivery. You can specify delivery instructions during checkout, and our drivers will leave your order at your doorstep. Payment can be made online or through contactless methods upon delivery."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through the Contact page on our website, by calling (825) 205-5115, or through WhatsApp. Our support team is available 7 days a week from 8 AM to 10 PM Eastern Time. You can also email us at info@lakeshoreconvenience.com."
    }
  ];

  if (loading) {
    return (
      <>
        <SEO 
          title="Frequently Asked Questions - Lakeshore Convenience"
          description="Find answers to common questions about ordering, delivery, payments, and more at Lakeshore Convenience. Serving customers across Canada with fresh groceries and convenience items."
          keywords="FAQ, frequently asked questions, grocery delivery, order help, Lakeshore Convenience, Canada"
          ogTitle="Frequently Asked Questions - Lakeshore Convenience"
          ogDescription="Find answers to common questions about ordering, delivery, payments, and more at Lakeshore Convenience."
          ogUrl="https://lakeshoreconvenience.com/faq"
          canonicalUrl="https://lakeshoreconvenience.com/faq"
        />
        <Navbar />
        <SkeletonLoader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Frequently Asked Questions - Lakeshore Convenience"
        description="Find answers to common questions about ordering, delivery, payments, and more at Lakeshore Convenience. Serving customers across Canada with fresh groceries and convenience items."
        keywords="FAQ, frequently asked questions, grocery delivery, order help, Lakeshore Convenience, Canada"
        ogTitle="Frequently Asked Questions - Lakeshore Convenience"
        ogDescription="Find answers to common questions about ordering, delivery, payments, and more at Lakeshore Convenience."
        ogUrl="https://lakeshoreconvenience.com/faq"
        canonicalUrl="https://lakeshoreconvenience.com/faq"
      />
      <OrganizationStructuredData />
      <FAQSchema questions={faqData} />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="p-4 bg-[#8BC34A]/10 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <FiHelpCircle className="text-[#8BC34A] text-4xl" />
                </motion.div>
              </div>
              <motion.h1 
                className="text-4xl sm:text-5xl font-dancingscript text-gray-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Frequently Asked Questions
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg max-w-2xl mx-auto font-cinzel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Find answers to common questions about our services, delivery, and more.
              </motion.p>
            </motion.div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md border border-[#8BC34A]/20 overflow-hidden transition-all duration-300 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 } 
                  }}
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="text-lg sm:text-xl font-cinzel font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <div className="ml-4 flex-shrink-0">
                      {openIndex === index ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronUp className="text-[#8BC34A] text-xl" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 180 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronDown className="text-[#8BC34A] text-xl" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-2 border-t border-gray-100"
                    >
                      <p className="text-gray-600 font-cinzel">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div 
              className="mt-12 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 } 
              }}
            >
              <h3 className="text-2xl font-dancingscript text-white mb-3">
                Still Have Questions?
              </h3>
              <p className="text-white/90 mb-6 font-cinzel">
                Our customer support team is here to help you with any additional questions.
              </p>
              <motion.a 
                href="/contact" 
                className="inline-block bg-white text-[#8BC34A] px-6 py-3 rounded-full font-cinzel font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default FAQ;