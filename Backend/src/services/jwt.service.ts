// src/services/jwt.service.ts
// JWT token generation and verification service

import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

interface TokenPayload {
    id: string;
}

// Generate JWT Token
export const generateToken = (userId: string): string => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as any }
    );
};

// Verify JWT Token
export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid token');
        }
        throw new ApiError(401, 'Token verification failed');
    }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, 'No token provided');
    }
    return authHeader.split(' ')[1];
};
