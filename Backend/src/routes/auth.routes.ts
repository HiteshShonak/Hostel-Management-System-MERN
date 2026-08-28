// src/routes/auth.routes.ts
// Authentication and user profile routes

import { Router } from 'express';
import { register, login } from '../controllers/auth.session.controller';
import { getMe, updateProfile, changePassword, updatePushToken } from '../controllers/auth.profile.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter, sensitiveLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    updatePushTokenSchema,
} from '../schemas/auth.schema';

const router = Router();

// ==================== PUBLIC ROUTES ====================
// User onboarding and authentication (rate-limited and schema-validated)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// ==================== PROTECTED ROUTES ====================
// Current user profile queries and self-service updates
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/password', protect, sensitiveLimiter, validate(changePasswordSchema), changePassword);
router.put('/push-token', protect, validate(updatePushTokenSchema), updatePushToken);

export default router;
