import axios from 'axios';

// Use production API URL deployed on Render
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://swd392-swagger-pages.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Increased timeout for Render cold starts
    withCredentials: false
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
    (response) => {
        // Return response.data directly for cleaner usage
        return response.data;
    },
    (error) => {
        // Return error with consistent structure
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject({
            status: error.response?.status,
            message: errorMessage,
            data: error.response?.data
        });
    }
);

export default api;
