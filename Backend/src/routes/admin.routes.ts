// src/routes/admin.routes.ts
// Admin routes for user management, parent-student linking, and full system oversight

import { Router } from 'express';
import {
    linkParentToStudent,
    unlinkParentFromStudent,
    getAllParentLinks,
    getUserRelations,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllGatePasses,
    getAllAttendance,
    getSystemStats,
    adminCancelGatePass,
    adminForceApproveGatePass,
    getAllNotices,
    adminDeleteNotice,
    getAllComplaints,
    // Warden Dashboard
    getWardenDashboardStats,
    getWardenStudentList,
    getStudentDetail,
    wardenMarkAttendance,
    // Admin Config
    getSystemConfig,
    updateSystemConfig,
} from '../controllers/admin.controller';
import { protect, adminOnly, wardenOrAdmin } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { linkParentSchema } from '../schemas/admin.schema';

const router = Router();

// Apply rate limiting and require authentication
router.use(generalLimiter);
router.use(protect);

// ==================== WARDEN ROUTES (warden or admin) ====================
router.use('/warden', wardenOrAdmin); // Apply role check to all /warden/* routes

// Warden dashboard stats
router.get('/warden/dashboard-stats', getWardenDashboardStats);

// Student management for warden
router.get('/warden/students', getWardenStudentList);
router.get('/warden/students/:id', getStudentDetail);
router.post('/warden/mark-attendance/:studentId', wardenMarkAttendance);

// ==================== ADMIN ONLY ROUTES ====================
router.use(adminOnly);

// Dashboard & Statistics
router.get('/stats', getSystemStats);
router.get('/system-stats', getSystemStats);

// System Configuration
router.get('/config', getSystemConfig);
router.put('/config', updateSystemConfig);

// Parent-student linking
router.post('/link-parent', validate(linkParentSchema), linkParentToStudent);
router.delete('/link-parent/:id', unlinkParentFromStudent);
router.get('/parent-links', getAllParentLinks);

// User management
router.get('/users', getAllUsers);
router.get('/user/:id/relations', getUserRelations);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Gate passes management (full control)
router.get('/gate-passes', getAllGatePasses);
router.delete('/gate-passes/:id', adminCancelGatePass);
router.put('/gate-passes/:id/approve', adminForceApproveGatePass);

// Attendance oversight
router.get('/attendance', getAllAttendance);

// Notices management (full control)
router.get('/notices', getAllNotices);
router.delete('/notices/:id', adminDeleteNotice);

// Complaints oversight
router.get('/complaints', getAllComplaints);

export default router;

