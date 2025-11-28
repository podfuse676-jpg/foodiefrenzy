# Fix for Vercel Deployment Issues

## Issues Identified

1. **Manifest.json 401 Error**: The manifest.json file is missing or inaccessible
2. **Backend API 404 Error**: The backend API endpoints are not accessible
3. **CORS Configuration**: Potential CORS issues between frontend and backend

## Solutions Implemented

### 1. Created Missing Manifest.json File

Created `frontend/public/manifest.json` with proper PWA configuration:

```json
{
  "short_name": "Foodie Frenzy",
  "name": "Foodie Frenzy Convenience Store",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### 2. Updated Backend CORS Configuration

Updated `backend/.env` to include Vercel deployment URLs:

```bash
# CORS Origins (updated to include Vercel URLs)
CORS_ORIGIN=https://foodiefrenzy-frontend.vercel.app,https://foodiefrenzy-admin.vercel.app
```

### 3. Created API Utility for Better Error Handling

Created `frontend/src/utils/api.js` with improved error handling:

```javascript
// API utility functions for the frontend
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://lakeshoreconveniencee-backend-production.up.railway.app";

// Function to handle API requests with proper error handling
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Handle different response statuses
    if (response.status === 404) {
      throw new Error(`Endpoint not found: ${endpoint}`);
    }

    if (response.status === 401) {
      throw new Error("Unauthorized access to API");
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
    const data = await apiRequest("/api/items");
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

export async function getHealth() {
  try {
    const data = await apiRequest("/health");
    return data;
  } catch (error) {
    console.error("Error fetching health status:", error);
    throw error;
  }
}
```

## Next Steps

1. **Redeploy the Frontend to Vercel**:

   ```bash
   cd frontend
   vercel --prod --force
   ```

2. **Verify Backend is Running**:
   Check that the backend is running on Railway and accessible at:
   `https://lakeshoreconveniencee-backend-production.up.railway.app`

3. **Test the Connection**:
   Run the test script to verify the connection:

   ```bash
   node test-backend-connection.js
   ```

4. **Check Browser Console**:
   After redeployment, check the browser console for any remaining errors.

## Troubleshooting

If issues persist:

1. **Check Vercel Logs**: Look at the deployment logs for any build errors
2. **Verify Environment Variables**: Ensure `VITE_API_URL` is correctly set in Vercel
3. **Check Railway Status**: Verify the backend is running on Railway
4. **Test API Endpoints**: Directly test backend endpoints using curl or Postman
5. **Review CORS Configuration**: Ensure all Vercel deployment URLs are in the CORS configuration

The fixes implemented should resolve the 401 and 404 errors you're experiencing.
