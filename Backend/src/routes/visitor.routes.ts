// src/routes/visitor.routes.ts
// Visitor routes

import { Router } from 'express';
import {
    getVisitors,
    registerVisitor,
    checkInVisitor,
    checkOutVisitor,
} from '../controllers/visitor.controller';
import { protect } from '../middleware/auth.middleware';
import { staffOnly } from '../middleware/role.middleware';

const router = Router();

// Student routes
router.get('/', protect, getVisitors);
router.post('/', protect, registerVisitor);

// Staff routes
router.put('/:id/checkin', protect, staffOnly, checkInVisitor);
router.put('/:id/checkout', protect, staffOnly, checkOutVisitor);

export default router;
