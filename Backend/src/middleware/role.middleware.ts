// src/middleware/role.middleware.ts
// Role-based access control middleware

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';

// Generic role checker
export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, 'Not authorized');
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
        }

        next();
    };
};

// Warden only (also allows admin)
export const wardenOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    if (req.user.role !== 'warden' && req.user.role !== 'admin') {
        throw new ApiError(403, 'Warden access required');
    }

    next();
};

// Mess staff only (also allows admin)
export const messStaffOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    if (req.user.role !== 'mess_staff' && req.user.role !== 'admin') {
        throw new ApiError(403, 'Mess staff access required');
    }

    next();
};

// Staff only (warden, mess_staff, or admin)
export const staffOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    const staffRoles = ['warden', 'mess_staff', 'admin'];
    if (!staffRoles.includes(req.user.role)) {
        throw new ApiError(403, 'Staff access required');
    }

    next();
};

// Guard or Warden (for QR validation)
export const guardOrWarden = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    const allowedRoles = ['guard', 'warden', 'admin'];
    if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(403, 'Guard or Warden access required');
    }

    next();
};

// Parent only (also allows admin)
export const parentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
        throw new ApiError(403, 'Parent access required');
    }

    next();
};

// Student only (also allows admin for testing)
export const studentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authorized');
    }

    if (req.user.role !== 'student' && req.user.role !== 'admin') {
        throw new ApiError(403, 'Student access required');
    }

    next();
};
