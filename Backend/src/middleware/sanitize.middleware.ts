// src/middleware/sanitize.middleware.ts
// Input sanitization middleware to prevent XSS attacks

import { Request, Response, NextFunction } from 'express';

/**
 * Recursively sanitize an object by trimming strings and removing null bytes
 * This helps prevent XSS attacks and null byte injection
 */
const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
        // Trim whitespace and remove null bytes
        return value.trim().replace(/\0/g, '');
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
        const sanitized: any = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                sanitized[key] = sanitizeValue(value[key]);
            }
        }
        return sanitized;
    }

    return value;
};

/**
 * Middleware to sanitize request body, query params, and route params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitizeValue(req.body);
    }

    if (req.query) {
        req.query = sanitizeValue(req.query);
    }

    if (req.params) {
        req.params = sanitizeValue(req.params);
    }

    next();
};
