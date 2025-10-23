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
                navigate('/checkout', { replace: true });
                return;
            }
            setStatusMsg('Payment was not completed.');
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
                console.log('Navigating to /myorder');
                navigate('/myorder', { replace: true });
            })
            .catch(err => {
                console.error('Confirmation error:', err);
                console.error('Error response:', err.response?.data);
                setStatusMsg('There was an error confirming your payment. Please check your order history.');
                // Don't clear cart on error - user might want to try again
            });
    }, [search, clearCart, navigate, authHeaders]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] flex items-center justify-center text-white">
            <div className="text-center p-8 bg-[#4b3b3b]/80 rounded-3xl">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
                <p className="text-xl">{statusMsg}</p>
            </div>
        </div>
    );
};

export default VerifyPaymentPage;