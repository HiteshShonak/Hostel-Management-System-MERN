// src/routes/gatepass.routes.ts
// Gate Pass routes with entry/exit tracking

import { Router } from 'express';
import {
    getGatePasses,
    getCurrentPass,
    requestGatePass,
    getPendingPasses,
    getAllPasses,
    approveGatePass,
    rejectGatePass,
    validateGatePass,
    markExit,
    markEntry,
    getStudentsOut,
    getRecentEntries,
    getActivityLogs,
} from '../controllers/gatepass.controller';
import { protect } from '../middleware/auth.middleware';
import { wardenOnly, guardOrWarden } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { requestGatePassSchema, validateGatePassSchema, gatePassIdSchema } from '../schemas/gatepass.schema';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Student routes
router.get('/', protect, getGatePasses);
router.get('/current', protect, getCurrentPass);
router.post('/', protect, validate(requestGatePassSchema), requestGatePass);

// Warden routes
router.get('/pending', protect, wardenOnly, getPendingPasses);
router.get('/all', protect, wardenOnly, getAllPasses);
router.put('/:id/approve', protect, wardenOnly, validate(gatePassIdSchema), approveGatePass);
router.put('/:id/reject', protect, wardenOnly, validate(gatePassIdSchema), rejectGatePass);

// Guard/Warden routes (QR validation and entry/exit tracking)
router.post('/validate', protect, guardOrWarden, validate(validateGatePassSchema), validateGatePass);
router.put('/:id/exit', protect, guardOrWarden, markExit);   // Mark student going out
router.put('/:id/entry', protect, guardOrWarden, markEntry); // Mark student coming in

// Entry/Exit tracking lists (Guard, Warden, Admin)
router.get('/students-out', protect, guardOrWarden, getStudentsOut);
router.get('/recent-entries', protect, guardOrWarden, getRecentEntries);
router.get('/logs', protect, guardOrWarden, getActivityLogs);

export default router;


