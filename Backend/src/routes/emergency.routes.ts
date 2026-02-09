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

const router = Router();

// Student routes
router.post('/', protect, sendSOS);
router.post('/sos', protect, sendSOS); // Alias for frontend compatibility
router.get('/', protect, getEmergencyHistory);
router.get('/history', protect, getEmergencyHistory); // Alias
router.get('/contacts', protect, getEmergencyContacts);

// Warden routes
router.get('/active', protect, wardenOnly, getActiveAlerts);
router.put('/:id/acknowledge', protect, wardenOnly, acknowledgeAlert);
router.put('/:id/resolve', protect, wardenOnly, resolveAlert);

export default router;
