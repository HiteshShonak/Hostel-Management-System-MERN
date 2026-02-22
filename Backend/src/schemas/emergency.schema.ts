// src/schemas/emergency.schema.ts
// Validation schemas for emergency endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

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
        id: objectId('emergency ID'),
    }),
});
