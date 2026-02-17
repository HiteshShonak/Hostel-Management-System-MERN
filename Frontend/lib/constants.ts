// frontend constants
// put all configurable stuff here

// api configuration
// uses env var for prod, localhost for dev
import Constants from 'expo-constants';

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    'https://hostel-management-system-backend-jde3.onrender.com/api'; // fallback link

// request timeout (in ms)
export const API_TIMEOUT = 15000;

// notification settings
// check for new notifications every 30 secs
export const NOTIFICATION_REFRESH_INTERVAL = 30000;

// ui colors
export const PRIMARY_COLOR = '#1d4ed8';
export const DANGER_COLOR = '#ef4444';
export const SUCCESS_COLOR = '#22c55e';
export const WARNING_COLOR = '#f59e0b';
