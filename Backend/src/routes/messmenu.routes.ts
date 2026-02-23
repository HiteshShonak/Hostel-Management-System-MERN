// src/routes/messmenu.routes.ts
// Mess Menu routes

import { Router } from 'express';
import { getMessMenu, updateDayMenu, updateTimings } from '../controllers/messmenu.controller';
import { protect } from '../middleware/auth.middleware';
import { messStaffOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateDayMenuSchema, updateTimingsSchema } from '../schemas/messmenu.schema';

const router = Router();
router.use(generalLimiter);

// Public route (all authenticated users can view)
router.get('/', protect, getMessMenu);

// Mess staff only (with validation)
router.put('/timings', protect, messStaffOnly, validate(updateTimingsSchema), updateTimings);
router.put('/:day', protect, messStaffOnly, validate(updateDayMenuSchema), updateDayMenu);

export default router;

