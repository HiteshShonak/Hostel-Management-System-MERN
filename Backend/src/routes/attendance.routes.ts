// src/routes/attendance.routes.ts
// Attendance routes

import { Router } from 'express';
import {
    getAttendance,
    markAttendance,
    getTodayAttendance,
    getAttendanceStats,
} from '../controllers/attendance.controller';
import { protect } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { markAttendanceSchema } from '../schemas/attendance.schema';

const router = Router();
router.use(generalLimiter);

// Student routes
router.get('/', protect, getAttendance);
router.post('/mark', protect, validate(markAttendanceSchema), markAttendance);
router.get('/today', protect, getTodayAttendance);
router.get('/stats', protect, getAttendanceStats);

export default router;
