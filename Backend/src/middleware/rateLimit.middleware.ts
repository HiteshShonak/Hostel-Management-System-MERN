// src/middleware/rateLimit.middleware.ts
// Rate limiting middleware for API protection

import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';

// General API rate limiter (200 requests per 15 minutes)
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            statusCode: 429,
            message: 'Too many requests. Please try again after 15 minutes.',
            data: null,
        });
    },
});

// Stricter limiter for auth routes (20 requests per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            statusCode: 429,
            message: 'Too many authentication attempts. Please try again after 15 minutes.',
            data: null,
        });
    },
});

// Sensitive operations limiter (10 requests per 15 minutes)
export const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            statusCode: 429,
            message: 'Too many attempts. Please try again after 15 minutes.',
            data: null,
        });
    },
});
