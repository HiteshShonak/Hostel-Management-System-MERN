// src/schemas/admin.schema.ts
// Validation schemas for admin endpoints

import { z } from 'zod';

export const linkParentSchema = z.object({
    body: z.object({
        parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent ID'),
        studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
        relationship: z.enum(['Father', 'Mother', 'Guardian'], {
            message: 'Relationship must be Father, Mother, or Guardian',
        }),
    }),
});

export const updateRoleSchema = z.object({
    body: z.object({
        role: z.enum(['student', 'admin', 'warden', 'mess_staff', 'guard', 'parent'], {
            message: 'Invalid role specified',
        }),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

export const userIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});
