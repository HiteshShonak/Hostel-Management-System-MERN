// src/routes/foodrating.routes.ts
// Food Rating routes

import { Router } from 'express';
import { rateMeal, getAverageRatings, getMyRatings } from '../controllers/foodrating.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Student routes
router.post('/', protect, rateMeal);
router.get('/average', protect, getAverageRatings);
router.get('/my', protect, getMyRatings);
router.get('/my-ratings', protect, getMyRatings); // Alias for frontend compatibility

export default router;
