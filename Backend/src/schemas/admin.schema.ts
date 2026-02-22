// src/schemas/admin.schema.ts
// validation schemas for admin endpoints

import { z } from 'zod';
import { objectId } from './common.schema';

export const linkParentSchema = z.object({
    body: z.object({
        parentId: objectId('parent ID'),
        studentId: objectId('student ID'),
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
        id: objectId('user ID'),
    }),
});

export const userIdSchema = z.object({
    params: z.object({
        id: objectId('user ID'),
    }),
});

// validates the complex nested system config update body
// all fields are optional since the frontend sends partial updates
export const updateSystemConfigSchema = z.object({
    body: z.object({
        hostelCoords: z.object({
            latitude: z.number().min(-90).max(90).optional(),
            longitude: z.number().min(-180).max(180).optional(),
            name: z.string().min(1).max(200).optional(),
        }).optional(),
        geofenceRadiusMeters: z.number().min(10).max(5000).optional(),
        attendanceWindow: z.object({
            enabled: z.boolean().optional(),
            startHour: z.number().int().min(0).max(23).optional(),
            endHour: z.number().int().min(0).max(23).optional(),
            timezone: z.string().min(1).max(100).optional(),
        }).optional(),
        appConfig: z.object({
            maxGatePassDays: z.number().int().min(1).max(90).optional(),
            maxPendingPasses: z.number().int().min(1).max(10).optional(),
            attendanceGracePeriod: z.number().int().min(0).max(60).optional(),
        }).optional(),
        emergencyContacts: z.array(z.object({
            name: z.string().min(1).max(100),
            phone: z.string().min(1).max(20),
            type: z.string().min(1).max(50),
        })).optional(),
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: 'At least one config field must be provided' }
    ),
});
