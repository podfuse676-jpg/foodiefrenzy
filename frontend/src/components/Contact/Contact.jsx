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

    // 3. Your WhatsApp number in international format (no "+" or spaces)
    const whatsappNumber = '18252055115';

    // 4. Build the WhatsApp Web URL:
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // existing toast
    toast.success('Opening WhatsApp…', {
      style: {
        border: '2px solid #8BC34A',
        padding: '16px',
        color: '#fff',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      },
      iconTheme: { primary: '#8BC34A', secondary: '#fff' },
    });

    // 5. Redirect:
    window.open(whatsappUrl, '_blank');

    // reset
    setFormData({ name: '', phone: '', email: '', address: '', product: '', query: '' });
  }


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800">
            Contact <span className="text-[#8BC34A]">Us</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help with all your grocery needs across Canada
          </p>
          <div className="w-24 h-1 bg-[#8BC34A] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="relative bg-white backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float border-l-4 border-[#8BC34A] hover:border-[#FFC107] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8BC34A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#8BC34A]/30 to-[#7CB342]/30 rounded-xl">
                  <FiMapPin className="text-[#8BC34A] text-2xl animate-pulse" />
                </div>
                <h3 className="ml-4 text-gray-800 text-xl font-semibold">Head Office</h3>
              </div>
              <div className="pl-12 relative z-10">
                <p className="text-gray-800 font-light text-lg">130-5003 Lakeshore Drive, Sylvan Lake, Alberta, T4S 1R3, Canada</p>
              </div>
            </div>
            <div className="relative bg-white backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float-delayed border-l-4 border-[#FFC107] hover:border-[#8BC34A] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC107]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#FFC107]/30 to-[#FF9800]/30 rounded-xl animate-ring">
                  <FiPhone className="text-[#FFC107] text-2xl" />
                </div>
                <h3 className="ml-4 text-gray-800 text-xl font-semibold">Contact Numbers</h3>
              </div>
              <div className="pl-12 space-y-2 relative z-10">
                <div className="flex items-center text-gray-800 font-light">
                  <FiGlobe className="text-[#FFC107] text-xl mr-2" />
                  (825) 205-5115
                </div>
              </div>
            </div>
            <div className="relative bg-white backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float-more-delayed border-l-4 border-[#FF9800] hover:border-[#FFC107] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF9800]/10 to-transparent group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#FF9800]/30 to-[#8BC34A]/30 rounded-xl">
                  <FiMail className="text-[#FF9800] text-2xl animate-pulse" />
                </div>
                <h3 className="ml-4 text-gray-800 text-xl font-semibold">Email Addresses</h3>
              </div>
              <div className="pl-12 relative z-10">
                <p className="text-gray-800 font-semibold text-base sm:text-lg break-words">
                  info@lakeshoreconvenience.com
                </p>
              </div>
            </div>
            
            {/* Nationwide Service Note */}
            <div className="bg-[#8BC34A]/10 border border-[#8BC34A]/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Nationwide Service</h3>
              <p className="text-gray-700 text-center">
                We proudly serve customers across all provinces and territories in Canada. 
                Whether you're in British Columbia, Ontario, Quebec, or any other region, 
                we're committed to bringing fresh groceries and convenience items directly to your doorstep.
              </p>
            </div>
          </div>
          
          {/* Contact Form Section */}
          <div className="relative bg-white backdrop-blur-lg rounded-2xl p-8 shadow-2xl animate-slide-in-right border-2 border-[#8BC34A]/30 hover:border-[#8BC34A]/50 transition-border duration-300">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#8BC34A]/30 rounded-full animate-ping-slow"></div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {contactFormFields.map(({ label, name, type, placeholder, pattern, Icon }) => (
                <div key={name}>
                  <label className="block text-gray-800 text-sm font-medium mb-2">{label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Icon className="text-[#8BC34A] text-xl animate-pulse" />
                    </div>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#8BC34A]/30 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent placeholder-gray-500"
                      placeholder={placeholder}
                      pattern={pattern}
                      required
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2">Your Query</label>
                <div className="relative">
                  <div className="absolute left-3 top-4">
                    <FiMessageSquare className="text-[#8BC34A] text-xl animate-pulse" />
                  </div>
                  <textarea
                    rows="4"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#8BC34A]/30 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent placeholder-gray-500"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[#8BC34A]/20 flex items-center justify-center space-x-2 group"
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