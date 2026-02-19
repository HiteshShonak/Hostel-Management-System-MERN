// src/schemas/attendance.schema.ts
// validation for attendance routes

import { z } from 'zod';

export const markAttendanceSchema = z.object({
    body: z.object({
        latitude: z.number({ message: 'Latitude is required' }).min(-90).max(90),
        longitude: z.number({ message: 'Longitude is required' }).min(-180).max(180),
    }),
});
