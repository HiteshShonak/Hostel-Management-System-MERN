// Frontend Constants Configuration
// =================================
// All configurable values should be placed here for easy management.
// For sensitive values like API URLs, consider using .env files.

// API Configuration
// -----------------
// Uses environment variable for production, falls back to localhost for development
// Set EXPO_PUBLIC_API_URL in your .env file or use expo-constants
import Constants from 'expo-constants';

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    'https://hostel-management-system-backend-jde3.onrender.com/api'; // Production fallback




// Request timeout in milliseconds
export const API_TIMEOUT = 15000;

// Notification Configuration
// --------------------------
// How often to refresh unread notification count (milliseconds)
export const NOTIFICATION_REFRESH_INTERVAL = 30000; // 30 seconds

// UI Configuration
// ----------------
export const PRIMARY_COLOR = '#1d4ed8';
export const DANGER_COLOR = '#ef4444';
export const SUCCESS_COLOR = '#22c55e';
export const WARNING_COLOR = '#f59e0b';
