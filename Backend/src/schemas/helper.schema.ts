// src/schemas/helper.schema.ts
// Validation schemas for helper role endpoints

import { z } from 'zod';

// Password requirements (same as auth)
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

// Helper registers a new user of any role — no token returned
export const helperRegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        email: z.string().email('Invalid email address'),
        password: passwordSchema,
        rollNo: z.string().min(1, 'Roll/Employee ID is required').max(50),
        room: z.string().min(1, 'Room is required').max(20),
        hostel: z.string().min(1, 'Hostel is required').max(100),
        phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
        role: z.enum(['student', 'warden', 'mess_staff', 'guard', 'admin', 'parent', 'helper']),
        year: z.number().int().min(1).max(4).optional(),
        parentEmail: z.string().email().optional(),
    }).superRefine((data, ctx) => {
        if (data.role === 'student' && (data.year === undefined || data.year === null)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Academic year is required for students (1–4)',
                path: ['year'],
            });
        }
    }),
});

// Helper force-resets any user's password (no current password needed)
export const helperResetPasswordSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
    }),
    body: z.object({
        newPassword: passwordSchema,
    }),
});

// Helper searches users
export const helperSearchSchema = z.object({
    query: z.object({
        search: z.string().optional(),
        role: z.enum(['student', 'warden', 'mess_staff', 'guard', 'admin', 'parent', 'helper']).optional(),
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
    }),
});

// User ID param schema
export const helperUserIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
    }),
});
