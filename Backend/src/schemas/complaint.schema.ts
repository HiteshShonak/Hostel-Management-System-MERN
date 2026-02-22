// src/schemas/complaint.schema.ts
// Validation schemas for complaint endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

export const createComplaintSchema = z.object({
    body: z.object({
        category: z.enum(['Plumbing', 'Electricity', 'WiFi', 'Other'], {
            message: 'Invalid category. Must be one of: Plumbing, Electricity, WiFi, Other',
        }),
        title: z.string().min(5, 'Title must be at least 5 characters').max(200),
        description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    }),
});

export const updateComplaintStatusSchema = z.object({
    body: z.object({
        status: z.enum(['Pending', 'In Progress', 'Resolved'], {
            message: 'Invalid status. Must be one of: Pending, In Progress, Resolved',
        }),
    }),
    params: z.object({
        id: objectId('complaint ID'),
    }),
});

export const complaintIdSchema = z.object({
    params: z.object({
        id: objectId('complaint ID'),
    }),
});

