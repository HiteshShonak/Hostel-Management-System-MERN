// IST date/time helpers for React Native
// Works on any device timezone by shifting UTC internally

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // GMT+5:30

// Shift date to IST (use UTC methods after this)
export const toIST = (date: Date | string | number): Date => {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Date(d.getTime() + IST_OFFSET_MS);
};

export const nowIST = (): Date => {
    return toIST(new Date());
};

export const getCurrentISTHour = (): number => {
    return nowIST().getUTCHours();
};

export const formatDateYMD = (date: Date): string => {
    const d = toIST(date);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const d = toIST(date);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC', // Display shifted date as-is
        ...options,
    };
    return d.toLocaleDateString('en-IN', defaultOptions);
};

export const formatDateLong = (date: Date | string): string => {
    return formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const formatDateWithDay = (date: Date | string): string => {
    return formatDate(date, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
};

export const formatTime = (date: Date | string): string => {
    const d = toIST(date);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    });
};

export const formatTime24 = (date: Date | string): string => {
    const d = toIST(date);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });
};

export const formatDateTime = (date: Date | string): string => {
    return `${formatDate(date)}, ${formatTime(date)}`;
};

export const getRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const d = new Date(date);
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

export const isToday = (date: Date | string): boolean => {
    const d = toIST(date);
    const today = nowIST();
    return (
        d.getUTCDate() === today.getUTCDate() &&
        d.getUTCMonth() === today.getUTCMonth() &&
        d.getUTCFullYear() === today.getUTCFullYear()
    );
};

export const startOfDay = (date?: Date | string): Date => {
    const d = date ? toIST(date) : nowIST();
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

export const endOfDay = (date?: Date | string): Date => {
    const d = date ? toIST(date) : nowIST();
    d.setUTCHours(23, 59, 59, 999);
    return d;
};

export const formatHour = (hour: number): string => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
};

// Check if current time is within a time window (handles overnight windows)
export const isWithinTimeWindow = (startHour: number, endHour: number): boolean => {
    const currentHour = getCurrentISTHour();
    if (startHour > endHour) {
        // Overnight window (e.g. 21:00 to 02:00)
        return currentHour >= startHour || currentHour < endHour;
    }
    return currentHour >= startHour && currentHour < endHour;
};
