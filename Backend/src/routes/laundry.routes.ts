// src/routes/laundry.routes.ts
// Laundry routes

import { Router } from 'express';
import {
    getLaundry,
    scheduleLaundry,
    updateLaundryStatus,
    markCollected,
} from '../controllers/laundry.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Student routes
router.get('/', protect, getLaundry);
router.post('/', protect, scheduleLaundry);
router.put('/:id/collect', protect, markCollected);

// Admin routes
router.put('/:id/status', protect, updateLaundryStatus);

export default router;
