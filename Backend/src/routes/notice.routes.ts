// src/routes/notice.routes.ts
// Notice routes

import { Router } from 'express';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../controllers/notice.controller';
import { protect } from '../middleware/auth.middleware';
import { staffOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { createNoticeSchema, updateNoticeSchema, noticeIdSchema } from '../schemas/notice.schema';

const router = Router();

// Apply rate limiting
router.use(generalLimiter);

// Public route (all authenticated users can view)
router.get('/', protect, getNotices);

// Staff routes (warden, mess_staff, or admin can create/update/delete)
router.post('/', protect, staffOnly, validate(createNoticeSchema), createNotice);
router.put('/:id', protect, staffOnly, validate(updateNoticeSchema), updateNotice);
router.delete('/:id', protect, staffOnly, validate(noticeIdSchema), deleteNotice);

export default router;
