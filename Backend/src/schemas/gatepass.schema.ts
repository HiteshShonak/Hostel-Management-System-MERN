// src/schemas/gatepass.schema.ts
// Validation schemas for gate pass endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

export const requestGatePassSchema = z.object({
    body: z.object({
        reason: z.string().min(5, 'Reason must be at least 5 characters').max(500),
        fromDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid from date',
        }),
        toDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid to date',
        }),
    }),
});

export const validateGatePassSchema = z.object({
    body: z.object({
        qrValue: z.string().min(1, 'QR value is required'),
    }),
});

export const gatePassIdSchema = z.object({
    params: z.object({
        id: objectId('gate pass ID'),
    }),
});

export const markExitEntrySchema = z.object({
    params: z.object({
        id: objectId('gate pass ID'),
    }),
});
