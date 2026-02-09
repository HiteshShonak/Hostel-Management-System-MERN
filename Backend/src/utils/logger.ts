// src/utils/logger.ts
// Production-grade logging utility for SmartHostel Backend
// Provides structured logging with different levels and formats

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
    [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

const levelColors: Record<LogLevel, string> = {
    debug: colors.gray,
    info: colors.green,
    warn: colors.yellow,
    error: colors.red,
};

const levelIcons: Record<LogLevel, string> = {
    debug: '🔍',
    info: '✅',
    warn: '⚠️',
    error: '❌',
};

/**
 * Format timestamp for logs
 */
const getTimestamp = (): string => {
    return new Date().toISOString();
};

/**
 * Format meta object for output
 */
const formatMeta = (meta?: LogMeta): string => {
    if (!meta || Object.keys(meta).length === 0) return '';
    return ` ${JSON.stringify(meta)}`;
};

/**
 * Log a message with specified level
 */
const log = (level: LogLevel, message: string, meta?: LogMeta): void => {
    const timestamp = getTimestamp();
    const icon = levelIcons[level];
    const color = levelColors[level];

    if (isDevelopment) {
        // Pretty format for development
        const formattedMeta = meta ? ` ${colors.cyan}${JSON.stringify(meta, null, 0)}${colors.reset}` : '';
        const output = `${colors.gray}[${timestamp}]${colors.reset} ${color}${level.toUpperCase().padEnd(5)}${colors.reset} ${icon} ${message}${formattedMeta}`;

        if (level === 'error') {
            console.error(output);
        } else if (level === 'warn') {
            console.warn(output);
        } else {
            console.log(output);
        }
    } else {
        // JSON format for production (easy to parse by log aggregators)
        const logEntry = {
            timestamp,
            level,
            message,
            ...(meta && { meta }),
        };

        if (level === 'error') {
            console.error(JSON.stringify(logEntry));
        } else if (level === 'warn') {
            console.warn(JSON.stringify(logEntry));
        } else {
            console.log(JSON.stringify(logEntry));
        }
    }
};

/**
 * Logger object with methods for each log level
 */
export const logger = {
    /**
     * Debug level - for development debugging
     * @example logger.debug('Processing request', { userId: '123' })
     */
    debug: (message: string, meta?: LogMeta): void => {
        if (isDevelopment) {
            log('debug', message, meta);
        }
    },

    /**
     * Info level - for general operational information
     * @example logger.info('Server started', { port: 5000 })
     */
    info: (message: string, meta?: LogMeta): void => {
        log('info', message, meta);
    },

    /**
     * Warn level - for warnings that don't prevent operation
     * @example logger.warn('Rate limit approaching', { ip: '192.168.1.1' })
     */
    warn: (message: string, meta?: LogMeta): void => {
        log('warn', message, meta);
    },

    /**
     * Error level - for errors that need attention
     * @example logger.error('Database connection failed', { error: err.message })
     */
    error: (message: string, meta?: LogMeta): void => {
        log('error', message, meta);
    },

    /**
     * Log HTTP request (used by Morgan middleware)
     */
    http: (message: string): void => {
        if (isDevelopment) {
            console.log(`${colors.blue}→${colors.reset} ${message}`);
        }
    },
};

export default logger;
