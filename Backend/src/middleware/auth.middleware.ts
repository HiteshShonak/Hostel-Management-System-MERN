// src/middleware/auth.middleware.ts
// Authentication middleware with production-grade patterns

import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken, extractTokenFromHeader } from '../services/jwt.service';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
        throw new ApiError(401, 'Not authorized - User not found');
    }

    req.user = user;
    next();
});

// Admin only middleware
export const adminOnly = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, 'Forbidden - Admin access required');
    }
    next();
});

// Warden or Admin middleware
export const wardenOrAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'warden' && req.user?.role !== 'admin') {
        throw new ApiError(403, 'Forbidden - Warden or Admin access required');
    }
    next();
});

