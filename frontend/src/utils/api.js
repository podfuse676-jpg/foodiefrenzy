// API utility functions for the frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lakeshore-convenience.onrender.com';

console.log('API Base URL:', API_BASE_URL);

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to handle API requests with proper error handling
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making API request to: ${url}`);
  
  // Check cache for GET requests
  if ((!options.method || options.method === 'GET') && cache.has(url)) {
    const cached = cache.get(url);
    const now = Date.now();
    
    if (now - cached.timestamp < CACHE_DURATION) {
      console.log(`Returning cached response for: ${url}`);
      return cached.data;
    } else {
      // Remove expired cache entry
      cache.delete(url);
    }
  }
  
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
      // Try to parse error response
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (e2) {
          // If we can't get text either, stick with the default message
        }
      }
      throw new Error(errorMessage);
    }
    
    // Try to parse JSON response
    try {
      const data = await response.json();
      
      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        cache.set(url, {
          data: data,
          timestamp: Date.now()
        });
        console.log(`Cached response for: ${url}`);
      }
      
      return data;
    } catch (parseError) {
      // If response is not JSON, return text
      const text = await response.text();
      
      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        cache.set(url, {
          data: text,
          timestamp: Date.now()
        });
        console.log(`Cached response for: ${url}`);
      }
      
      return text;
    }
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Function to clear cache for a specific endpoint
export function clearCache(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  cache.delete(url);
  console.log(`Cleared cache for: ${url}`);
}

// Function to clear all cache
export function clearAllCache() {
  cache.clear();
  console.log('Cleared all cache');
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
  clearCache,
  clearAllCache
};