// API utility functions for the frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lakeshoreconveniencee-backend-production.up.railway.app';

console.log('API Base URL:', API_BASE_URL);

// Function to handle API requests with proper error handling
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making API request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    console.log(`API response status: ${response.status}`);
    
    // Handle different response statuses
    if (response.status === 404) {
      throw new Error(`Endpoint not found: ${endpoint}`);
    }
    
    if (response.status === 401) {
      throw new Error('Unauthorized access to API');
    }
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Try to parse JSON response
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      // If response is not JSON, return text
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Specific API functions
export async function getItems() {
  try {
    const data = await apiRequest('/api/items');
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

export async function getHealth() {
  try {
    const data = await apiRequest('/health');
    return data;
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
}

export default {
  getItems,
  getHealth,
  apiRequest,
};