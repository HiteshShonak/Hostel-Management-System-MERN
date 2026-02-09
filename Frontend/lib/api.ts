import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT } from './constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            // Silently fail or minimal log
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Unwrap ApiResponse and handle errors
api.interceptors.response.use(
    (response) => {
        // Backend returns { statusCode, data, message, success }
        // Unwrap the 'data' field so frontend gets the actual data
        if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear token
            SecureStore.deleteItemAsync('token');
        }
        // Extract error message from ApiError response
        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper to save/get/remove token
export const saveToken = async (token: string) => {
    await SecureStore.setItemAsync('token', token);
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('token');
};

export const removeToken = async () => {
    await SecureStore.deleteItemAsync('token');
};

// Network error detection utilities
export const isNetworkError = (error: any): boolean => {
    return (
        error?.message === 'Network Error' ||
        error?.code === 'ECONNABORTED' ||
        error?.code === 'ERR_NETWORK' ||
        !error?.response
    );
};

export const isTimeoutError = (error: any): boolean => {
    return error?.code === 'ECONNABORTED' || error?.message?.includes('timeout');
};
