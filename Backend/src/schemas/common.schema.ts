// src/schemas/common.schema.ts
// shared zod helpers that every schema file can use

import { z } from 'zod';

// reusable MongoDB ObjectId validator - no more copy-pasting the regex everywhere
export const objectId = (label: string = 'ID') =>
    z.string().regex(/^[0-9a-fA-F]{24}$/, `Invalid ${label}`);

// reusable param schema for routes with :id in the URL
export const idParamSchema = (label: string = 'ID') => z.object({
    params: z.object({
        id: objectId(label),
    }),
});
