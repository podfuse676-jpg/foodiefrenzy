import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import ProfileCompletion from '../ProfileCompletion';

const PrivateRoute = ({ children }) => {
    // Check for authentication using consistent token key
    const token = localStorage.getItem('authToken');
    const loginData = localStorage.getItem('loginData');
    const isAuthenticated = Boolean(token) && Boolean(loginData) && token !== 'undefined' && token !== 'null';
    
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);
    
    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (!isAuthenticated) {
                setCheckingProfile(false);
                return;
            }
            
            try {
                const response = await axios.get(
                    `${apiConfig.baseURL}/api/user/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                if (response.data.success) {
                    const userProfile = response.data.user;
                    const isProfileCompleted = userProfile.profileCompleted || 
                                             (userProfile.firstName && userProfile.lastName);
                    
                    setProfileCompleted(isProfileCompleted);
                    setShowProfileForm(!isProfileCompleted);
                }
            } catch (error) {
                console.error('Error checking profile completion:', error);
                // If there's an error, we'll assume profile is not completed
                setShowProfileForm(true);
            } finally {
                setCheckingProfile(false);
            }
        };
        
        checkProfileCompletion();
    }, [isAuthenticated, token]);
    
    // Clear invalid tokens
    if (!isAuthenticated && (token === 'undefined' || token === 'null' || token === '')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('loginData');
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // If still checking profile, show loading
    if (checkingProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center">
                <div className="text-[#8BC34A] text-xl">Loading...</div>
            </div>
        );
    }
    
    // If profile is not completed, show profile completion form
    if (showProfileForm) {
        return <ProfileCompletion onComplete={() => {
            setProfileCompleted(true);
            setShowProfileForm(false);
        }} />;
    }
    
    // If authenticated and profile is completed, show the requested page
    return children;
};

export default PrivateRoute;