// src/routes/test.routes.ts
// Test routes for debugging

import { Router } from 'express';
import { testPushToMe, testPushToAllStudents, getPushStatus } from '../controllers/test.controller';
import { protect } from '../middleware/auth.middleware';
import { sensitiveLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// only enable test routes in development - no need in production
if (process.env.NODE_ENV === 'production') {
    router.use((_req, res) => {
        res.status(404).json({ message: 'Test routes disabled in production' });
    });
} else {
    // strict limits so nobody spams push notifications
    router.use(sensitiveLimiter);

    // All test routes require authentication
    router.post('/push-to-me', protect, testPushToMe);
    router.post('/push-to-students', protect, testPushToAllStudents);
    router.get('/push-status', protect, getPushStatus);
}

export default router;
