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

const router = Router();

// Student routes
router.get('/', protect, getAttendance);
router.post('/mark', protect, markAttendance);
router.get('/today', protect, getTodayAttendance);
router.get('/stats', protect, getAttendanceStats);

export default router;
