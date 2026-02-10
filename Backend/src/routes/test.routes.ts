// src/routes/test.routes.ts
// Test routes for debugging

import { Router } from 'express';
import { testPushToMe, testPushToAllStudents, getPushStatus } from '../controllers/test.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All test routes require authentication
router.post('/push-to-me', protect, testPushToMe);
router.post('/push-to-students', protect, testPushToAllStudents);
router.get('/push-status', protect, getPushStatus);

export default router;
