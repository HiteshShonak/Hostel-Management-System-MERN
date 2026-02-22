// src/schemas/parent.schema.ts
// validation for parent routes

import { z } from 'zod';
import { objectId } from './common.schema';

export const passIdSchema = z.object({
    params: z.object({
        id: objectId('pass ID'),
    }),
});

export const rejectPassSchema = z.object({
    params: z.object({
        id: objectId('pass ID'),
    }),
    body: z.object({
        reason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(500),
    }),
});

export const studentIdSchema = z.object({
    params: z.object({
        studentId: objectId('student ID'),
    }),
});
