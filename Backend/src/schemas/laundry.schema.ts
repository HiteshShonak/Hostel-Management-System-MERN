// src/schemas/laundry.schema.ts
// Validation schemas for laundry endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

export const scheduleLaundrySchema = z.object({
    body: z.object({
        items: z.number().min(1, 'Must have at least 1 item').max(50),
        pickupDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid pickup date',
        }),
    }),
});

export const laundryIdSchema = z.object({
    params: z.object({
        id: objectId('laundry ID'),
    }),
});
