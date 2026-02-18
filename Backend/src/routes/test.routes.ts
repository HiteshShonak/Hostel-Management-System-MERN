// src/routes/test.routes.ts
// Test routes for debugging

import { Router } from 'express';
import { testPushToMe, testPushToAllStudents, getPushStatus } from '../controllers/test.controller';
import { protect } from '../middleware/auth.middleware';
import { sensitiveLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// strict limits so nobody spams push notifications
router.use(sensitiveLimiter);

// All test routes require authentication
router.post('/push-to-me', protect, testPushToMe);
router.post('/push-to-students', protect, testPushToAllStudents);
router.get('/push-status', protect, getPushStatus);

export default router;
