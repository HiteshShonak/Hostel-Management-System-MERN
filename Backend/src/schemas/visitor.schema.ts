// src/schemas/visitor.schema.ts
// Validation schemas for visitor endpoints

import { z } from 'zod';

export const registerVisitorSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
        purpose: z.string().min(5, 'Purpose must be at least 5 characters').max(500),
        idProof: z.string().optional(),
    }),
});
