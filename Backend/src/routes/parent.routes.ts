// src/routes/parent.routes.ts
// Parent routes for managing children and approving gate passes

import { Router } from 'express';
import {
    getChildren,
    getPendingPasses,
    getAllChildrenPasses,
    approvePass,
    rejectPass,
    getChildAttendance,
    getTodayAttendance,
} from '../controllers/parent.controller';
import { protect } from '../middleware/auth.middleware';
import { parentOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { passIdSchema, rejectPassSchema, studentIdSchema } from '../schemas/parent.schema';

const router = Router();

// Apply rate limiting and require parent access
router.use(generalLimiter);
router.use(protect);
router.use(parentOnly);

// Children management
router.get('/children', getChildren);

// Gate passes
router.get('/pending-passes', getPendingPasses);
router.get('/passes', getAllChildrenPasses);
router.put('/passes/:id/approve', validate(passIdSchema), approvePass);
router.put('/passes/:id/reject', validate(rejectPassSchema), rejectPass);

// Attendance
router.get('/today-attendance', getTodayAttendance);
router.get('/children/:studentId/attendance', validate(studentIdSchema), getChildAttendance);

export default router;
