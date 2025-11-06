import axios from 'axios';
import apiConfig from './apiConfig';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }
    
    // Handle specific HTTP errors
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        return Promise.reject(new Error('Access forbidden. You do not have permission to perform this action.'));
      case 404:
        return Promise.reject(new Error('Resource not found.'));
      case 500:
        return Promise.reject(new Error('Internal server error. Please try again later.'));
      default:
        return Promise.reject(new Error(error.response.data?.message || 'An unexpected error occurred.'));
    }
  }
);

// Wrapper function for API calls with fallback
export const apiCallWithFallback = async (apiFunction, fallbackData = null) => {
  try {
    const response = await apiFunction();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API call failed:', error.message);
    
    // If fallback data is provided, return it
    if (fallbackData !== null) {
      console.log('Using fallback data');
      return { data: fallbackData, error: error.message };
    }
    
    // Otherwise, re-throw the error
    throw error;
  }
};

export default apiClient;