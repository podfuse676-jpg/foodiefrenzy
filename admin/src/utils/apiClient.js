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
    const token = localStorage.getItem('adminToken');
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
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
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

// Wrapper function for API calls - removed fallback mechanism
export const apiCallWithFallback = async (apiFunction) => {
  try {
    const response = await apiFunction();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API call failed:', error.message);
    throw error; // Always re-throw the error instead of using fallback data
  }
};

export default apiClient;