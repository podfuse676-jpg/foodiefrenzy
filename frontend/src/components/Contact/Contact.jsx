import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiMessageSquare, FiGlobe, FiSmartphone, FiHome, FiArrowRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { contactFormFields } from '../../assets/dummydata'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', product: '', query: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Build the message text from your formData:
    const message = `
      Name: ${formData.name}
      Phone: ${formData.phone}
      Email: ${formData.email}
      Address: ${formData.address}
      Product: ${formData.product}
      Query: ${formData.query}
    `;

    // 2. URL‑encode it
    const encodedMessage = encodeURIComponent(message);

    // 3. Your WhatsApp number in international format (no “+” or spaces)
    const whatsappNumber = '918299431275';

    // 4. Build the WhatsApp Web URL:
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // existing toast
    toast.success('Opening WhatsApp…', {
      style: {
        border: '2px solid #4CAF50',
        padding: '16px',
        color: '#fff',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      },
      iconTheme: { primary: '#4CAF50', secondary: '#fff' },
    });

    // 5. Redirect:
    window.open(whatsappUrl, '_blank');

    // reset
    setFormData({ name: '', phone: '', email: '', address: '', product: '', query: '' });
  }


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#333333] via-[#444444] to-[#4CAF50] animate-gradient-x py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-[Poppins] relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />
      {/* Additional decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#4CAF50]/20 rounded-full animate-float"></div>
      <div className="absolute bottom-40 right-20 w-16 h-16 bg-[#F4D03F]/20 rounded-full animate-float-delayed"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-in-down">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#F4D03F]">
            Connect With Us
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float border-l-4 border-[#4CAF50] hover:border-[#F4D03F] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50]/30 to-[#388E3C]/30 rounded-xl">
                  <FiMapPin className="text-[#4CAF50] text-2xl animate-pulse" />
                </div>
                <h3 className="ml-4 text-[#FAFAFA] text-xl font-semibold">Our Headquarter</h3>
              </div>
              <div className="pl-12 relative z-10">
                <p className="text-[#FAFAFA] font-light text-lg">529 Triveni Nagar Lucknow, UP 226020</p>
              </div>
            </div>
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float-delayed border-l-4 border-[#F4D03F] hover:border-[#4CAF50] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4D03F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#F4D03F]/30 to-[#E74C3C]/30 rounded-xl animate-ring">
                  <FiPhone className="text-[#F4D03F] text-2xl" />
                </div>
                <h3 className="ml-4 text-[#FAFAFA] text-xl font-semibold">Contact Numbers</h3>
              </div>
              <div className="pl-12 space-y-2 relative z-10">
                <div className="flex items-center text-[#FAFAFA] font-light">
                  <FiGlobe className="text-[#F4D03F] text-xl mr-2" />
                  +91 8299431275
                </div>
              </div>
            </div>
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float-more-delayed border-l-4 border-[#E74C3C] hover:border-[#F4D03F] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E74C3C]/10 to-transparent group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#E74C3C]/30 to-[#4CAF50]/30 rounded-xl">
                  <FiMail className="text-[#E74C3C] text-2xl animate-pulse" />
                </div>
                <h3 className="ml-4 text-[#FAFAFA] text-xl font-semibold">Email Addresses</h3>
              </div>
              <div className="pl-12 relative z-10">
                <p className="text-[#FAFAFA] font-semibold text-base sm:text-lg break-words">
                  hexagonsservices@gmail.com
                </p>
              </div>
            </div>
          </div>
          {/* Contact Form Section */}
          <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl animate-slide-in-right border-2 border-[#4CAF50]/30 hover:border-[#4CAF50]/50 transition-border duration-300">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#4CAF50]/30 rounded-full animate-ping-slow"></div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {contactFormFields.map(({ label, name, type, placeholder, pattern, Icon }) => (
                <div key={name}>
                  <label className="block text-[#FAFAFA] text-sm font-medium mb-2">{label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Icon className="text-[#4CAF50] text-xl animate-pulse" />
                    </div>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border-2 border-[#4CAF50]/30 rounded-xl text-[#FAFAFA] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder-[#FAFAFA]/50"
                      placeholder={placeholder}
                      pattern={pattern}
                      required
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-[#FAFAFA] text-sm font-medium mb-2">Your Query</label>
                <div className="relative">
                  <div className="absolute left-3 top-4">
                    <FiMessageSquare className="text-[#4CAF50] text-xl animate-pulse" />
                  </div>
                  <textarea
                    rows="4"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border-2 border-[#4CAF50]/30 rounded-xl text-[#FAFAFA] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder-[#FAFAFA]/50"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#4CAF50] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[#4CAF50]/20 flex items-center justify-center space-x-2 group"
              >
                <span>Submit Query</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

