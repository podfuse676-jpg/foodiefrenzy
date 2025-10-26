import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';

const CheckoutPage = () => {
  const { totalAmount, cartItems: rawCart, clearCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '',
    email: '', address: '', city: '',
    zipCode: '', paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Grab token from localStorage (support both authToken and token keys)
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  // Ensure proper Bearer token format for authorization header
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Handle redirect back from payment gateway - only for cancel cases
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment_status');

    console.log('CheckoutPage useEffect triggered with params:', { paymentStatus });

    if (paymentStatus === 'cancel') {
      // User cancelled or payment failed
      console.log('Payment cancelled or failed');
      setError('Payment was cancelled or failed. Your cart remains intact.');
    }
  }, [location.search]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.zipCode || 
        !formData.paymentMethod) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Calculate pricing with delivery and COD fees
    const subtotal = Number(totalAmount.toFixed(2));
    const tax = Number((subtotal * 0.05).toFixed(2));
    const deliveryCharge = 5.00; // $5 CAD delivery charge
    const codFee = formData.paymentMethod === 'cod' ? 5.00 : 0; // $5 CAD extra for COD
    const total = Number((subtotal + tax + deliveryCharge + codFee).toFixed(2));

    const payload = {
      ...formData,
      subtotal,
      tax,
      deliveryCharge,
      codFee,
      total,
      items: cartItems.map(({ item, quantity, selectedSize }) => ({
        name: item.name,
        price: selectedSize?.price ?? item.price,
        quantity,
        imageUrl: item.imageUrl || null,
        selectedSize: selectedSize || undefined
      }))
    };

    try {
      if (formData.paymentMethod === 'card') {
        // Stripe Payment: create checkout session
        try {
          const { data } = await axios.post(
            `${apiConfig.baseURL}/api/orders`,
            payload,
            { 
              headers: authHeaders
            }
          );
          // Redirect to external payment gateway (Stripe)
          if (data.checkoutUrl) {
            console.log('Redirecting to Stripe checkout URL:', data.checkoutUrl);
            window.location.href = data.checkoutUrl;
          } else {
            setError('Payment gateway URL not received. Please try again.');
          }
        } catch (err) {
          console.error('Card payment error:', err);
          setError(err.response?.data?.message || 'Failed to process card payment');
          setLoading(false);
        }
      } else if (formData.paymentMethod === 'cod') {
        // Cash on Delivery: directly create order
        try {
          const { data } = await axios.post(
            `${apiConfig.baseURL}/api/orders`,
            payload,
            { 
              headers: authHeaders
            }
          );
          clearCart();
          // For COD, the backend returns { order: orderObject }
          navigate('/myorder', { state: { order: data.order } });
        } catch (err) {
          console.error('COD order submission error:', err);
          setError(err.response?.data?.message || 'Failed to submit order');
          setLoading(false);
        }
      } else {
        setError('Please select a payment method');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit order');
      setLoading(false);
    }
  };

  return (
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-b from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/cart" className="flex items-center gap-2 text-[#8BC34A] mb-8">
          <FaArrowLeft /> Back to Cart
        </Link>
        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">

          {/* Personal Info Section */}
          <div className="bg-white/80 p-6 rounded-3xl space-y-6 border border-[#8BC34A]/20">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
            <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
          </div>

          {/* Payment Section */}
          <div className="bg-white/80 p-6 rounded-3xl space-y-6 border border-[#8BC34A]/20">
            <h2 className="text-2xl font-bold">Payment Details</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Your Order Items</h3>
              {cartItems.map(({ _id, item, quantity, selectedSize }) => {
                // Use selected size price if available, otherwise use item price
                const price = selectedSize?.price ?? item?.price ?? 0;
                const totalPrice = price * quantity;
                
                return (
                  <div key={_id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="text-gray-800">{item.name}</span>
                      {selectedSize && (
                        <span className="ml-2 text-[#8BC34A]/80 text-sm">({selectedSize.size})</span>
                      )}
                      <span className="ml-2 text-[#8BC34A]/80 text-sm">x{quantity}</span>
                    </div>
                    <span className="text-[#FFC107]">${totalPrice.toFixed(2)} CAD</span>
                  </div>
                );
              })}
            </div>

            <PaymentSummary 
              totalAmount={totalAmount} 
              paymentMethod={formData.paymentMethod}
            />

            {/* Payment Method */}
            <div>
              <label className="block mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-[#8BC34A]/30 rounded-xl px-4 py-3"
              >
                <option value="">Select Method</option>
                <option value="cod">Cash on Delivery (+$5.00 CAD)</option>
                <option value="card">Credit/Debit Card</option>
              </select>
              {formData.paymentMethod === 'cod' && (
                <p className="text-[#8BC34A] text-sm mt-2">
                  ⚠️ Additional $5.00 CAD fee for Cash on Delivery
                </p>
              )}
            </div>

            {/* Card Payment Info */}
            {formData.paymentMethod === 'card' && (
              <div className="bg-[#8BC34A]/20 border border-[#8BC34A]/30 rounded-xl p-4">
                <p className="text-gray-800 text-sm mb-2">
                  🔒 Secure payment powered by Stripe
                </p>
                <p className="text-gray-800/70 text-xs">
                  You will be redirected to a secure payment page to complete your purchase.
                </p>
              </div>
            )}

            {error && <p className="text-[#FF9800] mt-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] py-4 rounded-xl font-bold flex justify-center items-center text-white"
            >
              <FaLock className="mr-2" /> {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = 'text', value, onChange, required = false }) => (
  <div>
    <label className="block mb-1">{label} {required && <span className="text-[#FF9800]">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white border border-[#8BC34A]/30 rounded-xl px-4 py-2"
    />
  </div>
);

const PaymentSummary = ({ totalAmount, paymentMethod }) => {
  const subtotal = Number(totalAmount.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const deliveryCharge = 5.00;
  const codFee = paymentMethod === 'cod' ? 5.00 : 0;
  const total = Number((subtotal + tax + deliveryCharge + codFee).toFixed(2));
  
  return (
    <div className="space-y-2 bg-[#8BC34A]/10 p-4 rounded-xl border border-[#8BC34A]/20">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
      <div className="flex justify-between text-gray-800/80">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between text-gray-800/80">
        <span>Tax (5% GST):</span>
        <span>${tax.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between text-gray-800/80">
        <span>Delivery Charge:</span>
        <span>${deliveryCharge.toFixed(2)} CAD</span>
      </div>
      {codFee > 0 && (
        <div className="flex justify-between text-[#FFC107]">
          <span>COD Fee:</span>
          <span>+${codFee.toFixed(2)} CAD</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg border-t border-[#8BC34A]/30 pt-2 mt-2 text-[#FFC107]">
        <span>Total:</span>
        <span>${total.toFixed(2)} CAD</span>
      </div>
    </div>
  );
};

export default CheckoutPage;