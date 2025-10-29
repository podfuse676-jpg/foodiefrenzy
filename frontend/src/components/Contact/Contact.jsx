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
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-r from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] animate-gradient-x py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-[Poppins] relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />
      {/* Additional decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#8BC34A]/20 rounded-full animate-float"></div>
      <div className="absolute bottom-40 right-20 w-16 h-16 bg-[#FFC107]/20 rounded-full animate-float-delayed"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-in-down">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8BC34A] to-[#FFC107]">
            Connect With Us
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="relative bg-white backdrop-blur-lg rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-card-float border-l-4 border-[#8BC34A] hover:border-[#FFC107] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8BC34A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="flex items-center mb-4 relative z-10">
                <div className="p-3 bg-gradient-to-br from-[#8BC34A]/30 to-[#7CB342]/30 rounded-xl">
                  <FiMapPin className="text-[#8BC34A] text-2xl animate-pulse" />
                </div>
                <h3 className="ml-4 text-gray-800 text-xl font-semibold">Our Headquarter</h3>
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