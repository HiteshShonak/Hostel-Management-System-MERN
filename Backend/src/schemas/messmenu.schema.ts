// src/schemas/messmenu.schema.ts
// validation for mess menu routes

import { z } from 'zod';

const timeStringSchema = z.string().regex(/^\d{1,2}:\d{2}$/, 'Invalid time format (expected HH:MM)');

const mealItemsSchema = z.object({
    Breakfast: z.array(z.string().min(1)).optional(),
    Lunch: z.array(z.string().min(1)).optional(),
    Dinner: z.array(z.string().min(1)).optional(),
});

const timingEntrySchema = z.object({
    start: timeStringSchema,
    end: timeStringSchema,
});

export const updateDayMenuSchema = z.object({
    params: z.object({
        day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
            message: 'Invalid day. Must be Monday-Sunday',
        }),
    }),
    body: z.object({
        meals: mealItemsSchema,
    }),
});

export const updateTimingsSchema = z.object({
    body: z.object({
        timings: z.object({
            Breakfast: timingEntrySchema,
            Lunch: timingEntrySchema,
            Dinner: timingEntrySchema,
        }),
    }),
});
