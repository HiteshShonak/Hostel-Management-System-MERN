// src/routes/emergency.routes.ts
// Emergency routes

import { Router } from 'express';
import {
    sendSOS,
    getEmergencyHistory,
    getEmergencyContacts,
    getActiveAlerts,
    acknowledgeAlert,
    resolveAlert,
} from '../controllers/emergency.controller';
import { protect } from '../middleware/auth.middleware';
import { wardenOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendSOSSchema, emergencyIdSchema } from '../schemas/emergency.schema';

const router = Router();

// rate limit SOS to prevent abuse
router.use(generalLimiter);

// Student routes
router.post('/', protect, validate(sendSOSSchema), sendSOS);
router.post('/sos', protect, validate(sendSOSSchema), sendSOS); // Alias for frontend compatibility
router.get('/', protect, getEmergencyHistory);
router.get('/history', protect, getEmergencyHistory); // Alias
router.get('/contacts', protect, getEmergencyContacts);

// Warden routes
router.get('/active', protect, wardenOnly, getActiveAlerts);
router.put('/:id/acknowledge', protect, wardenOnly, validate(emergencyIdSchema), acknowledgeAlert);
router.put('/:id/resolve', protect, wardenOnly, validate(emergencyIdSchema), resolveAlert);

export default router;
