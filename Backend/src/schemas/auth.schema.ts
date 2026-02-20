// src/schemas/auth.schema.ts
// Validation schemas for authentication endpoints

import { z } from 'zod';

// Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        email: z.string().email('Invalid email address'),
        password: passwordSchema,
        rollNo: z.string().min(1, 'Roll number is required').max(50),
        room: z.string().min(1, 'Room number is required').max(20),
        hostel: z.string().min(1, 'Hostel name is required').max(100),
        phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
        role: z.enum(['student', 'warden', 'mess_staff', 'guard', 'admin', 'parent']).optional(),
        // Optional parent email for auto-linking when student registers
        parentEmail: z.string().email('Invalid parent email').optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        phone: z.string().min(10).max(15).optional(),
        room: z.string().min(1).max(20).optional(),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
    }),
});

export const updatePushTokenSchema = z.object({
    body: z.object({
        pushToken: z.string().min(1, 'Push token is required'),
    }),
});
