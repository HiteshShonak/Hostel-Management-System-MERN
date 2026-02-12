// IST timezone helpers for Sonipat hostel (GMT+5:30)

// Get current time shifted to IST (for hour checks, date logic)
export const getISTTime = (): Date => {
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(Date.now() + istOffset);
};

// Get today's date at midnight IST (for DB queries)
export const getISTDate = (): Date => {
    const istTime = getISTTime();
    istTime.setUTCHours(0, 0, 0, 0);
    return istTime;
};

// Convert date to midnight IST
export const toISTDate = (date: Date): Date => {
    const dateString = date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const istDate = new Date(dateString);
    istDate.setUTCHours(0, 0, 0, 0);
    return istDate;
};

// Get current hour in IST (0-23)
export const getCurrentISTHour = (): number => {
    return getISTTime().getUTCHours();
};
