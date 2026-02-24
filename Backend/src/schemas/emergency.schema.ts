// src/schemas/emergency.schema.ts
// Validation schemas for emergency endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

export const sendSOSSchema = z.object({
    body: z.object({
        type: z.enum(['Medical', 'Fire', 'Ragging', 'Other'], {
            message: 'Invalid emergency type',
        }),
        message: z.string().max(500).optional().default(''),
        location: z.string().max(200).optional().default(''),
    }),
});

export const emergencyIdSchema = z.object({
    params: z.object({
        id: objectId('emergency ID'),
    }),
});
