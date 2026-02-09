// src/routes/messmenu.routes.ts
// Mess Menu routes

import { Router } from 'express';
import { getMessMenu, updateDayMenu, updateTimings } from '../controllers/messmenu.controller';
import { protect } from '../middleware/auth.middleware';
import { messStaffOnly } from '../middleware/role.middleware';

const router = Router();

// Public route (all authenticated users can view)
router.get('/', protect, getMessMenu);

// Mess staff only
router.put('/timings', protect, messStaffOnly, updateTimings);
router.put('/:day', protect, messStaffOnly, updateDayMenu);

export default router;

