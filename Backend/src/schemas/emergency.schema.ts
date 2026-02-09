// src/schemas/emergency.schema.ts
// Validation schemas for emergency endpoints

import { z } from 'zod';

export const sendSOSSchema = z.object({
    body: z.object({
        type: z.enum(['Medical', 'Fire', 'Security', 'Other'], {
            message: 'Invalid emergency type',
        }),
        message: z.string().min(10, 'Message must be at least 10 characters').max(500),
        location: z.string().min(2, 'Location is required').max(200),
    }),
});

export const emergencyIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid emergency ID'),
    }),
});
