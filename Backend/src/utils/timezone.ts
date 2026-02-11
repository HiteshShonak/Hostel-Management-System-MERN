// IST Timezone Utilities
// ======================
// All date/time operations for HMS app use Indian Standard Time (IST/Asia/Kolkata)
// The hostel is located in Sonipat, Haryana, India - GMT+5:30

/**
 * Get current date/time in IST timezone
 * @returns Date object representing current IST time
 */
export const getISTTime = (): Date => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60 * 1000; // GMT+5:30
    return new Date(utcTime + istOffset);
};

/**
 * Get start of today in IST (00:00:00)
 * Useful for date-based queries
 * @returns Date object for today's start in IST
 */
export const getISTDate = (): Date => {
    const istTime = getISTTime();
    istTime.setHours(0, 0, 0, 0);
    return istTime;
};

/**
 * Convert any date to IST start of day (00:00:00)
 * @param date - Date to convert
 * @returns Date object for start of that day in IST
 */
export const toISTDate = (date: Date): Date => {
    const dateString = date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const istDate = new Date(dateString);
    istDate.setHours(0, 0, 0, 0);
    return istDate;
};

/**
 * Get current hour in IST (0-23)
 * @returns Hour in 24-hour format
 */
export const getCurrentISTHour = (): number => {
    return getISTTime().getHours();
};
