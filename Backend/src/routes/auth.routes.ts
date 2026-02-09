// src/routes/auth.routes.ts
// Authentication routes

import { Router } from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter, sensitiveLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../schemas/auth.schema';

const router = Router();

// Public routes (with rate limiting and validation)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/password', protect, sensitiveLimiter, validate(changePasswordSchema), changePassword);

export default router;
