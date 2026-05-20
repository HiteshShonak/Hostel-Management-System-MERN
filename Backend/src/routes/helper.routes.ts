// src/routes/helper.routes.ts
// Routes for the helper role — registration operators with elevated identity management powers

import { Router } from 'express';
import {
    helperRegisterUser,
    helperResetPassword,
    helperSearchUsers,
    helperGetUser,
} from '../controllers/helper.controller';
import { protect } from '../middleware/auth.middleware';
import { helperOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import {
    helperRegisterSchema,
    helperResetPasswordSchema,
    helperSearchSchema,
    helperUserIdSchema,
} from '../schemas/helper.schema';

const router = Router();

// All helper routes require authentication and helper (or admin) role
router.use(generalLimiter);
router.use(protect);
router.use(helperOnly);

// Register a new user (no JWT token returned)
router.post('/register', validate(helperRegisterSchema), helperRegisterUser);

// Force-reset any user's password
router.put('/users/:id/reset-password', validate(helperResetPasswordSchema), helperResetPassword);

// Search and list users
router.get('/users', validate(helperSearchSchema), helperSearchUsers);

// Get a single user by ID
router.get('/users/:id', validate(helperUserIdSchema), helperGetUser);

export default router;
