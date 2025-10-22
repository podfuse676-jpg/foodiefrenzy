import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import axios from 'axios';

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

  // Handle redirect back from payment gateway
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment_status');
    const sessionId = params.get('session_id');

    if (paymentStatus) {
      setLoading(true);
      if (paymentStatus === 'success' && sessionId) {
        // Confirm the payment and create order on the backend
        axios.post(
          'http://localhost:4000/api/orders/confirm',
          { sessionId },
          { headers: authHeaders }
        )
          .then(({ data }) => {
            // Only clear cart when payment truly succeeded
            clearCart();
            navigate('/myorder', { state: { order: data } });
          })
          .catch(err => {
            console.error('Payment confirmation error:', err);
            setError('Payment confirmation failed. Please contact support.');
          })
          .finally(() => setLoading(false));
      } else if (paymentStatus === 'cancel') {
        // User cancelled or payment failed
        setError('Payment was cancelled or failed. Your cart remains intact.');
        setLoading(false);
      }
    }
  }, [location.search, clearCart, navigate, authHeaders]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
            'http://localhost:4000/api/orders',
            payload,
            { 
              headers: authHeaders
            }
          );
          // Redirect to external payment gateway (Stripe)
          if (data.checkoutUrl) {
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
            'http://localhost:4000/api/orders',
            payload,
            { 
              headers: authHeaders
            }
          );
          clearCart();
          // Make sure we're passing the correct data structure
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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/cart" className="flex items-center gap-2 text-amber-400 mb-8">
          <FaArrowLeft /> Back to Cart
        </Link>
        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">

          {/* Personal Info Section */}
          <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
            <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
          </div>

          {/* Payment Section */}
          <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Payment Details</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-amber-100">Your Order Items</h3>
              {cartItems.map(({ _id, item, quantity, selectedSize }) => {
                // Use selected size price if available, otherwise use item price
                const price = selectedSize?.price ?? item?.price ?? 0;
                const totalPrice = price * quantity;
                
                return (
                  <div key={_id} className="flex justify-between items-center bg-[#3a2b2b]/50 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="text-amber-100">{item.name}</span>
                      {selectedSize && (
                        <span className="ml-2 text-amber-500/80 text-sm">({selectedSize.size})</span>
                      )}
                      <span className="ml-2 text-amber-500/80 text-sm">x{quantity}</span>
                    </div>
                    <span className="text-amber-300">${totalPrice.toFixed(2)} CAD</span>
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
                className="w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-3"
              >
                <option value="">Select Method</option>
                <option value="cod">Cash on Delivery (+$5.00 CAD)</option>
                <option value="card">Credit/Debit Card</option>
              </select>
              {formData.paymentMethod === 'cod' && (
                <p className="text-amber-400 text-sm mt-2">
                  ⚠️ Additional $5.00 CAD fee for Cash on Delivery
                </p>
              )}
            </div>

            {/* Card Payment Info */}
            {formData.paymentMethod === 'card' && (
              <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-4">
                <p className="text-amber-100 text-sm mb-2">
                  🔒 Secure payment powered by Stripe
                </p>
                <p className="text-amber-100/70 text-xs">
                  You will be redirected to a secure payment page to complete your purchase.
                </p>
              </div>
            )}

            {error && <p className="text-red-400 mt-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 py-4 rounded-xl font-bold flex justify-center items-center"
            >
              <FaLock className="mr-2" /> {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = 'text', value, onChange }) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-2"
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
    <div className="space-y-2 bg-amber-900/10 p-4 rounded-xl border border-amber-800/20">
      <h3 className="text-lg font-semibold text-amber-100 mb-3">Order Summary</h3>
      <div className="flex justify-between text-amber-100/80">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between text-amber-100/80">
        <span>Tax (5% GST):</span>
        <span>${tax.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between text-amber-100/80">
        <span>Delivery Charge:</span>
        <span>${deliveryCharge.toFixed(2)} CAD</span>
      </div>
      {codFee > 0 && (
        <div className="flex justify-between text-amber-400">
          <span>COD Fee:</span>
          <span>+${codFee.toFixed(2)} CAD</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-lg border-t border-amber-800/30 pt-2 mt-2 text-amber-300">
        <span>Total:</span>
        <span>${total.toFixed(2)} CAD</span>
      </div>
    </div>
  );
};

export default CheckoutPage;