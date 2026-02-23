import { Router } from 'express';
import authRoutes from './auth.routes';
import gatepassRoutes from './gatepass.routes';
import noticeRoutes from './notice.routes';
import messmenuRoutes from './messmenu.routes';
import complaintRoutes from './complaint.routes';
import attendanceRoutes from './attendance.routes';
import emergencyRoutes from './emergency.routes';
import foodRatingRoutes from './foodrating.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import parentRoutes from './parent.routes';
import testRoutes from './test.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/gatepass', gatepassRoutes);
router.use('/notices', noticeRoutes);
router.use('/messmenu', messmenuRoutes);
router.use('/complaints', complaintRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/food-rating', foodRatingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/parent', parentRoutes);
router.use('/test', testRoutes);

export default router;

