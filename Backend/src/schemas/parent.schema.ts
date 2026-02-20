// src/schemas/parent.schema.ts
// validation for parent routes

import { z } from 'zod';

export const passIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid pass ID'),
    }),
});

export const rejectPassSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid pass ID'),
    }),
    body: z.object({
        reason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(500),
    }),
});

export const studentIdSchema = z.object({
    params: z.object({
        studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    }),
});
