// src/routes/foodrating.routes.ts
// Food Rating routes

import { Router } from 'express';
import { rateMeal, getAverageRatings, getMyRatings } from '../controllers/foodrating.controller';
import { protect } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { rateMealSchema } from '../schemas/foodrating.schema';

const router = Router();
router.use(generalLimiter);

// Student routes
router.post('/', protect, validate(rateMealSchema), rateMeal);
router.get('/average', protect, getAverageRatings);
router.get('/my', protect, getMyRatings);
router.get('/my-ratings', protect, getMyRatings); // Alias for frontend compatibility

export default router;
