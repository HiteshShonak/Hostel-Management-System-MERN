// src/routes/gatepass.routes.ts
// Standard gate pass routing: Student requests, Warden approvals, Guard scanning, and Activity logs

import { Router } from 'express';
import {
    getGatePasses,
    getCurrentPass,
    requestGatePass,
} from '../controllers/gatepass.request.controller';
import {
    getPendingPasses,
    getAllPasses,
    approveGatePass,
    rejectGatePass,
} from '../controllers/gatepass.approval.controller';
import {
    validateGatePass,
    markExit,
    markEntry,
} from '../controllers/gatepass.guard.controller';
import {
    getStudentsOut,
    getRecentEntries,
    getActivityLogs,
} from '../controllers/gatepass.logs.controller';
import { protect } from '../middleware/auth.middleware';
import { wardenOnly, guardOrWarden } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import {
    requestGatePassSchema,
    validateGatePassSchema,
    gatePassIdSchema,
    markExitEntrySchema,
} from '../schemas/gatepass.schema';

const router = Router();

// Apply general rate limiting across all gate pass operations
router.use(generalLimiter);

// ==================== STUDENT ROUTES ====================
// View student's gate passes and check active pass status
router.get('/', protect, getGatePasses);
router.get('/current', protect, getCurrentPass);
router.post('/', protect, validate(requestGatePassSchema), requestGatePass);

// ==================== WARDEN ROUTES ====================
// Review pending pass requests and approve or reject
router.get('/pending', protect, wardenOnly, getPendingPasses);
router.get('/all', protect, wardenOnly, getAllPasses);
router.put('/:id/approve', protect, wardenOnly, validate(gatePassIdSchema), approveGatePass);
router.put('/:id/reject', protect, wardenOnly, validate(gatePassIdSchema), rejectGatePass);

// ==================== GUARD SCANNER ROUTES ====================
// QR scanner validation and live entry/exit recording
router.post('/validate', protect, guardOrWarden, validate(validateGatePassSchema), validateGatePass);
router.put('/:id/exit', protect, guardOrWarden, validate(markExitEntrySchema), markExit);
router.put('/:id/entry', protect, guardOrWarden, validate(markExitEntrySchema), markEntry);

// ==================== HEADCOUNT & AUDIT LOGS ====================
// Query active headcount status, entries today, and complete logs
router.get('/students-out', protect, guardOrWarden, getStudentsOut);
router.get('/recent-entries', protect, guardOrWarden, getRecentEntries);
router.get('/logs', protect, guardOrWarden, getActivityLogs);

export default router;
