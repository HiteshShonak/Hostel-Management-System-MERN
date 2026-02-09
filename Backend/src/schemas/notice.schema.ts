// src/schemas/notice.schema.ts
// Validation schemas for notice endpoints

import { z } from 'zod';

export const createNoticeSchema = z.object({
    body: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters').max(200),
        description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
        urgent: z.boolean().optional(),
        source: z.enum(['warden', 'mess_staff', 'system']).optional(),
    }),
});

export const updateNoticeSchema = z.object({
    body: z.object({
        title: z.string().min(5).max(200).optional(),
        description: z.string().min(10).max(2000).optional(),
        urgent: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notice ID'),
    }),
});

export const noticeIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notice ID'),
    }),
});
