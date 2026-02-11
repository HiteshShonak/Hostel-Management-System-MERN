/**
 * Date and time utilities for Indian Standard Time (IST)
 * All functions return dates/times in Asia/Kolkata timezone
 */

const IST_TIMEZONE = 'Asia/Kolkata';
const IST_LOCALE = 'en-IN';

/**
 * Convert any date to IST timezone
 */
export const toIST = (date: Date | string | number): Date => {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    // Create a new date in IST timezone
    const istString = d.toLocaleString('en-US', { timeZone: IST_TIMEZONE });
    return new Date(istString);
};

/**
 * Get current date/time in IST
 */
export const nowIST = (): Date => {
    return toIST(new Date());
};

/**
 * Get current hour in IST (0-23)
 */
export const getCurrentISTHour = (): number => {
    return nowIST().getHours();
};

/**
 * Format date in Indian format (e.g., "15 Jan 2024")
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const d = toIST(date);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    };
    return d.toLocaleDateString(IST_LOCALE, defaultOptions);
};

/**
 * Format date with full details (e.g., "Monday, 15 January 2024")
 */
export const formatDateLong = (date: Date | string): string => {
    return formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Format date with weekday (e.g., "Mon, 15 Jan")
 */
export const formatDateWithDay = (date: Date | string): string => {
    return formatDate(date, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
};

/**
 * Format time in 12-hour format (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string): string => {
    const d = toIST(date);
    return d.toLocaleTimeString(IST_LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Format time in 24-hour format (e.g., "14:30")
 */
export const formatTime24 = (date: Date | string): string => {
    const d = toIST(date);
    return d.toLocaleTimeString(IST_LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

/**
 * Format date and time together (e.g., "15 Jan 2024, 2:30 PM")
 */
export const formatDateTime = (date: Date | string): string => {
    return `${formatDate(date)}, ${formatTime(date)}`;
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date: Date | string): string => {
    const d = toIST(date);
    const now = nowIST();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return formatDate(date);
};

/**
 * Check if a date is today in IST
 */
export const isToday = (date: Date | string): boolean => {
    const d = toIST(date);
    const today = nowIST();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

/**
 * Get start of day in IST (12:00 AM)
 */
export const startOfDay = (date?: Date | string): Date => {
    const d = date ? toIST(date) : nowIST();
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get end of day in IST (11:59 PM)
 */
export const endOfDay = (date?: Date | string): Date => {
    const d = date ? toIST(date) : nowIST();
    d.setHours(23, 59, 59, 999);
    return d;
};

/**
 * Format hour for display (e.g., 14 -> "2 PM", 9 -> "9 AM")
 */
export const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
};

/**
 * Check if current time is within a time window (in IST)
 */
export const isWithinTimeWindow = (startHour: number, endHour: number): boolean => {
    const currentHour = getCurrentISTHour();
    return currentHour >= startHour && currentHour <= endHour;
};
