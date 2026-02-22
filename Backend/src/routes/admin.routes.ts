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
import { protect, adminOnly } from '../middleware/auth.middleware';
import { wardenOnly } from '../middleware/role.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import {
    linkParentSchema,
    updateRoleSchema,
    userIdSchema,
    updateSystemConfigSchema,
} from '../schemas/admin.schema';
import { gatePassIdSchema } from '../schemas/gatepass.schema';
import { noticeIdSchema } from '../schemas/notice.schema';
import { studentIdSchema } from '../schemas/parent.schema';

const router = Router();

// Apply rate limiting and require authentication
router.use(generalLimiter);
router.use(protect);

// ==================== WARDEN ROUTES (warden or admin) ====================
router.use('/warden', wardenOnly); // Apply role check to all /warden/* routes

// Warden dashboard stats
router.get('/warden/dashboard-stats', getWardenDashboardStats);

// Student management for warden
router.get('/warden/students', getWardenStudentList);
router.get('/warden/students/:id', validate(userIdSchema), getStudentDetail);
router.post('/warden/mark-attendance/:studentId', validate(studentIdSchema), wardenMarkAttendance);

// ==================== PUBLIC CONFIG (any authenticated user can read) ====================
// This MUST be before adminOnly so students/wardens/parents can read config
router.get('/config', getSystemConfig);

// ==================== ADMIN ONLY ROUTES ====================
router.use(adminOnly);

// Dashboard & Statistics
router.get('/stats', getSystemStats);
router.get('/system-stats', getSystemStats);

// System Configuration (write is admin-only)
router.put('/config', validate(updateSystemConfigSchema), updateSystemConfig);

// Parent-student linking
router.post('/link-parent', validate(linkParentSchema), linkParentToStudent);
router.delete('/link-parent/:id', validate(userIdSchema), unlinkParentFromStudent);
router.get('/parent-links', getAllParentLinks);

// User management
router.get('/users', getAllUsers);
router.get('/user/:id/relations', validate(userIdSchema), getUserRelations);
router.put('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.delete('/users/:id', validate(userIdSchema), deleteUser);

// Gate passes management (full control)
router.get('/gate-passes', getAllGatePasses);
router.delete('/gate-passes/:id', validate(gatePassIdSchema), adminCancelGatePass);
router.put('/gate-passes/:id/approve', validate(gatePassIdSchema), adminForceApproveGatePass);

// Attendance oversight
router.get('/attendance', getAllAttendance);

// Notices management (full control)
router.get('/notices', getAllNotices);
router.delete('/notices/:id', validate(noticeIdSchema), adminDeleteNotice);

// Complaints oversight
router.get('/complaints', getAllComplaints);

export default router;

