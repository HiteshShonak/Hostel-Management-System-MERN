// src/schemas/foodrating.schema.ts
// validation for food rating routes

import { z } from 'zod';

export const rateMealSchema = z.object({
    body: z.object({
        mealType: z.enum(['Breakfast', 'Lunch', 'Dinner'], {
            message: 'Invalid meal type. Must be Breakfast, Lunch, or Dinner',
        }),
        rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
        comment: z.string().max(500).optional(),
    }),
});
