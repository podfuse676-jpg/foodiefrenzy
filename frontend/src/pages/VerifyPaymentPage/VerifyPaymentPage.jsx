import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../CartContext/CartContext';
import apiConfig from '../../utils/apiConfig';

const VerifyPaymentPage = () => {
    const { clearCart } = useCart();
    const { search } = useLocation();
    const navigate = useNavigate();
    const [statusMsg, setStatusMsg] = useState('Verifying payment…');
    const [isSuccess, setIsSuccess] = useState(false);

    // Grab token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    
    console.log('VerifyPaymentPage mounted with token:', token ? 'present' : 'missing');
    console.log('Current location search:', search);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const success = params.get('success');
        const session_id = params.get('session_id');

        console.log('VerifyPaymentPage params:', { success, session_id });

        // Cancelled or missing session:
        if (success !== 'true' || !session_id) {
            if (success === 'false') {
                // User explicitly cancelled
                console.log('Payment cancelled, redirecting to checkout');
                setStatusMsg('Payment was cancelled. Redirecting to checkout...');
                setTimeout(() => {
                    navigate('/checkout', { replace: true });
                }, 3000);
                return;
            }
            setStatusMsg('Payment was not completed. Please try again.');
            setTimeout(() => {
                navigate('/checkout', { replace: true });
            }, 3000);
            return;
        }

        // Stripe says success=true & we have a session_id:
        console.log('Confirming payment with session ID:', session_id);
        console.log('Using API URL:', `${apiConfig.baseURL}/api/orders/confirm`);
        console.log('Using auth headers:', authHeaders);
        
        axios.post(`${apiConfig.baseURL}/api/orders/confirm`, 
            { sessionId: session_id },
            { headers: authHeaders }
        )
            .then((response) => {
                console.log('Payment confirmed successfully:', response.data);
                // Only clear the cart on true success:
                clearCart();
                setIsSuccess(true);
                setStatusMsg('Payment confirmed successfully! Redirecting to your orders...');
                console.log('Navigating to /myorder');
                setTimeout(() => {
                    navigate('/myorder', { replace: true });
                }, 2000);
            })
            .catch(err => {
                console.error('Confirmation error:', err);
                console.error('Error response:', err.response?.data);
                setStatusMsg('There was an error confirming your payment. Please check your order history.');
                // Don't clear cart on error - user might want to try again
                // Only redirect to orders page if we're sure the payment was processed
                // For now, let's stay on this page so user can see the error
                // setTimeout(() => {
                //     navigate('/myorder', { replace: true });
                // }, 3000);
            });
    }, [search, clearCart, navigate, authHeaders]);

    return (
        // Updated to light fresh colors
        <div className="min-h-screen bg-gradient-to-b from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-gray-800">
            <div className="text-center p-8 bg-white/80 rounded-3xl border-2 border-[#8BC34A]/30">
                <div className={`rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4 flex items-center justify-center ${isSuccess ? 'border-[#8BC34A]' : 'border-[#FFC107] animate-spin'}`}>
                    {isSuccess ? (
                        <svg className="w-8 h-8 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )}
                </div>
                <p className="text-xl">{statusMsg}</p>
                {isSuccess && (
                    <p className="text-sm text-[#8BC34A]/70 mt-2">Your order is being processed</p>
                )}
            </div>
        </div>
    );
};

export default VerifyPaymentPage;