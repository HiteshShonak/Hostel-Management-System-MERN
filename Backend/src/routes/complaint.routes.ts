// src/routes/complaint.routes.ts
// Complaint routes

import { Router } from 'express';
import {
    getComplaints,
    createComplaint,
    getAllComplaints,
    resolveComplaint,
    updateComplaintStatus,
} from '../controllers/complaint.controller';
import { protect } from '../middleware/auth.middleware';
import { wardenOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { createComplaintSchema, updateComplaintStatusSchema, complaintIdSchema } from '../schemas/complaint.schema';

const router = Router();

// Apply general rate limiting
router.use(generalLimiter);

// Student routes
router.get('/', protect, getComplaints);
router.post('/', protect, validate(createComplaintSchema), createComplaint);

// Warden routes
router.get('/all', protect, wardenOnly, getAllComplaints);
router.put('/:id/resolve', protect, wardenOnly, validate(complaintIdSchema), resolveComplaint);
router.put('/:id/status', protect, wardenOnly, validate(updateComplaintStatusSchema), updateComplaintStatus);

export default router;

