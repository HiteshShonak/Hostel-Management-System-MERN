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
    process.env.EXPO_PUBLIC_API_URL
    ||'http://10.255.12.130:5000/api' ||
    Constants.expoConfig?.extra?.apiUrl

    

// Request timeout in milliseconds
export const API_TIMEOUT = 15000;

// Smart Attendance Configuration
// ------------------------------
// Time window for showing Smart Attendance on student dashboard
// 24-hour format: 19 = 7 PM, 20 = 8 PM
export const ATTENDANCE_START_HOUR = 19; // 7 PM
export const ATTENDANCE_END_HOUR = 20;   // Midnight (adjust as needed)

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
