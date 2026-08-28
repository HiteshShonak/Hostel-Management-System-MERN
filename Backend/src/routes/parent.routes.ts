// src/routes/parent.routes.ts
// Parent routes for managing children and approving gate passes

import { Router } from 'express';
import {
    getChildren,
    getAllChildrenPasses,
} from '../controllers/parent.children.controller';
import {
    getPendingPasses,
    approvePass,
    rejectPass,
} from '../controllers/parent.passes.controller';
import { protect } from '../middleware/auth.middleware';
import { parentOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { passIdSchema, rejectPassSchema } from '../schemas/parent.schema';

const router = Router();

// Apply rate limiting and require parent access
router.use(generalLimiter);
router.use(protect);
router.use(parentOnly);

// ==================== CHILDREN DISCOVERY ====================
// View linked student profiles and paginated gate pass history
router.get('/children', getChildren);
router.get('/passes', getAllChildrenPasses);

// ==================== GATE PASS APPROVALS ====================
// Review pending requests, authorize, or reject with reason
router.get('/pending-passes', getPendingPasses);
router.put('/passes/:id/approve', validate(passIdSchema), approvePass);
router.put('/passes/:id/reject', validate(rejectPassSchema), rejectPass);

export default router;
