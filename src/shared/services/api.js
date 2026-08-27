import axios from 'axios';

// Base Axios instance configured for JSONPlaceholder REST API
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: for logging and custom request transformations
api.interceptors.request.use(
  (config) => {
    // Helpful debug logging in dev mode
    if (import.meta.env?.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: for standardized error handling and response unwrapping
api.interceptors.response.use(
  (response) => {
    if (import.meta.env?.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected network error occurred.';
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      errorMessage = `Server Error (${error.response.status}): ${error.response.statusText || 'Operation failed'}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Network Error: No response received from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Request configuration error.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    
    console.error('[API Error]', errorMessage, error);
    return Promise.reject(enhancedError);
  }
);

export default api;
