// src/routes/payment.routes.ts
// Payment routes

import { Router } from 'express';
import { getPayments, createPayment, payPayment } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';
import { wardenOnly } from '../middleware/role.middleware';

const router = Router();

// Student routes
router.get('/', protect, getPayments);
router.put('/:id/pay', protect, payPayment);

// Warden routes
router.post('/', protect, wardenOnly, createPayment);

export default router;
