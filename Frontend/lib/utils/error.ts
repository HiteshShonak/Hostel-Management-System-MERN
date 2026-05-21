/**
 * User-friendly error message utilities
 * Converts API errors into readable messages for users
 */

// Common error messages mapped to user-friendly text
const ERROR_MESSAGES: Record<string, string> = {
    // Authentication errors
    'Invalid credentials': 'Email or password is incorrect. Please try again.',
    'User not found': 'No account found with this email. Please register first.',
    'Email already exists': 'An account with this email already exists. Try logging in instead.',
    'Invalid token': 'Your session has expired. Please log in again.',
    'Not authorized': 'You don\'t have permission to do this.',
    'Forbidden': 'Access denied. You don\'t have the required permissions.',

    // Validation errors
    'Validation failed': 'Please check your input and try again.',
    'Required field': 'Please fill in all required fields.',
    'Invalid email': 'Please enter a valid email address.',
    'Password too short': 'Password must be at least 6 characters long.',
    'Invalid phone': 'Please enter a valid phone number.',

    // Gate pass errors
    'Gate pass not found': 'This gate pass doesn\'t exist or has been deleted.',
    'Already approved': 'This pass has already been approved.',
    'Already rejected': 'This pass has already been rejected.',
    'Pass expired': 'This gate pass has expired.',
    'Not your pass': 'You can only manage your own gate passes.',
    'Pending limit reached': 'You have too many pending passes. Wait for approval first.',
    'Invalid dates': 'The dates you selected are invalid. Check from/to dates.',
    'Past date': 'Start date cannot be in the past.',
    'End before start': 'End time must be after start time.',

    // Attendance errors
    'Already marked': 'Attendance has already been marked for today.',
    'Outside attendance window': 'Attendance can only be marked during the designated time window.',
    'Too far from hostel': 'You are too far from the hostel to mark attendance.',
    'Location required': 'Please enable location services to mark attendance.',

    // Network errors
    'Network Error': 'Unable to connect. Please check your internet connection.',
    'timeout': 'Request timed out. Please try again.',
    'ECONNREFUSED': 'Server is not responding. Please try again later.',

    // Generic
    'Something went wrong': 'An unexpected error occurred. Please try again.',
};

/**
 * Extract user-friendly message from error
 */
export function getErrorMessage(error: unknown): string {
    if (!error) return 'An unexpected error occurred.';

    // Handle Axios error structure
    if (typeof error === 'object' && error !== null) {
        const err = error as any;

        // Check for API response error
        if (err.response?.data) {
            const data = err.response.data;

            // Check for message field
            const apiMessage = data.message || data.error || data.msg;
            if (apiMessage && typeof apiMessage === 'string') {
                // Look for user-friendly mapping
                for (const [key, friendlyMsg] of Object.entries(ERROR_MESSAGES)) {
                    if (apiMessage.toLowerCase().includes(key.toLowerCase())) {
                        return friendlyMsg;
                    }
                }
                // Return API message if reasonably user-friendly
                if (apiMessage.length < 100 && !apiMessage.includes('Error:')) {
                    return apiMessage;
                }
            }

            // Handle validation errors array
            if (data.errors && Array.isArray(data.errors)) {
                return data.errors.map((e: any) => e.message || e.msg).join('. ');
            }

            // Server error
            if (err.response.status >= 500) {
                return 'Server error. Our team has been notified. Please try again later.';
            }
        }

        // Network error
        if (err.message === 'Network Error' || err.code === 'ECONNREFUSED') {
            return ERROR_MESSAGES['Network Error'];
        }

        // Timeout
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
            return ERROR_MESSAGES['timeout'];
        }

        // Standard Error object
        if (err.message && typeof err.message === 'string') {
            for (const [key, friendlyMsg] of Object.entries(ERROR_MESSAGES)) {
                if (err.message.toLowerCase().includes(key.toLowerCase())) {
                    return friendlyMsg;
                }
            }
            // Return message if it's user-friendly
            if (err.message.length < 80) {
                return err.message;
            }
        }
    }

    // String error
    if (typeof error === 'string') {
        for (const [key, friendlyMsg] of Object.entries(ERROR_MESSAGES)) {
            if (error.toLowerCase().includes(key.toLowerCase())) {
                return friendlyMsg;
            }
        }
        if (error.length < 80) return error;
    }

    return 'Something went wrong. Please try again.';
}

/**
 * Get error title based on error type
 */
export function getErrorTitle(error: unknown): string {
    if (!error) return 'Error';

    const err = error as any;

    if (err.response?.status) {
        const status = err.response.status;
        if (status === 401) return 'Session Expired';
        if (status === 403) return 'Access Denied';
        if (status === 404) return 'Not Found';
        if (status === 422) return 'Invalid Input';
        if (status >= 500) return 'Server Error';
    }

    if (err.message?.includes('Network') || err.code === 'ECONNREFUSED') {
        return 'Connection Error';
    }

    return 'Error';
}
