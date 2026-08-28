// Admin & Warden controller for user management, parent-student relationships, system config, and oversight

import { Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { getISTDate, toISTDate, getISTTime } from '../utils/timezone';

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Link parent account to student account
export const linkParentToStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { parentId, studentId, relationship } = req.body;

    // Validate parent exists and has parent role
    const parent = await User.findById(parentId);
    if (!parent) {
        throw new ApiError(404, 'Parent user not found');
    }
    if (parent.role !== 'parent') {
        throw new ApiError(400, 'User is not registered as a parent');
    }

    // Validate student exists and is a student
    const student = await User.findById(studentId);
    if (!student) {
        throw new ApiError(404, 'Student user not found');
    }
    if (student.role !== 'student') {
        throw new ApiError(400, 'User is not a student');
    }

    // Check if link already exists
    const existingLink = await ParentStudent.findOne({ parent: parentId, student: studentId });
    if (existingLink) {
        throw new ApiError(409, 'This parent-student relationship already exists');
    }

    // Create the link
    const link = await ParentStudent.create({
        parent: parentId,
        student: studentId,
        relationship,
        linkedBy: req.user?._id,
        status: 'active',
    });

    // Populate for response
    const populatedLink = await ParentStudent.findById(link._id)
        .populate('parent', 'name email phone')
        .populate('student', 'name email rollNo room hostel')
        .populate('linkedBy', 'name');

    return res.status(201).json(new ApiResponse(201, populatedLink, 'Parent-student link created successfully'));
});

// Unlink parent and student relationship
export const unlinkParentFromStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const link = await ParentStudent.findById(req.params.id);

    if (!link) {
        throw new ApiError(404, 'Parent-student link not found');
    }

    // Soft delete by setting status to inactive
    link.status = 'inactive';
    await link.save();

    return res.status(200).json(new ApiResponse(200, null, 'Parent-student link removed successfully'));
});

// Retrieve all active parent-student links with pagination
export const getAllParentLinks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [links, total] = await Promise.all([
        ParentStudent.find({ status: 'active' })
            .populate('parent', 'name email phone')
            .populate('student', 'name rollNo room hostel email')
            .populate('linkedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ParentStudent.countDocuments({ status: 'active' }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { links, pagination }, 'Parent-student links retrieved'));
});

// Retrieve parent-student relationships for a specific user ID
export const getUserRelations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    // Get user to determine role
    const user = await User.findById(userId).select('name email role rollNo');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Use aggregation to get relations efficiently
    const relations = await ParentStudent.aggregate([
        {
            $match: {
                $or: [
                    { parent: new Types.ObjectId(userId as string) },
                    { student: new Types.ObjectId(userId as string) }
                ],
                status: 'active'
            }
        },
        // Lookup parent details
        {
            $lookup: {
                from: 'users',
                localField: 'parent',
                foreignField: '_id',
                as: 'parentInfo'
            }
        },
        // Lookup student details
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'studentInfo'
            }
        },
        { $unwind: '$parentInfo' },
        { $unwind: '$studentInfo' },
        {
            $project: {
                _id: 1,
                relationship: 1,
                status: 1,
                createdAt: 1,
                parent: {
                    _id: '$parentInfo._id',
                    name: '$parentInfo.name',
                    email: '$parentInfo.email',
                    phone: '$parentInfo.phone'
                },
                student: {
                    _id: '$studentInfo._id',
                    name: '$studentInfo.name',
                    email: '$studentInfo.email',
                    rollNo: '$studentInfo.rollNo',
                    room: '$studentInfo.room',
                    hostel: '$studentInfo.hostel',
                    year: '$studentInfo.year'
                }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, { user, relations }, 'User relations retrieved'));
});

// List all users with optional role and search filters
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { role, search } = req.query;

    // Build filter
    const filter: any = {};
    if (role) {
        filter.role = role;
    }
    if (search) {
        const escaped = escapeRegex(search as string);
        filter.$or = [
            { name: { $regex: escaped, $options: 'i' } },
            { email: { $regex: escaped, $options: 'i' } },
            { rollNo: { $regex: escaped, $options: 'i' } },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('name email rollNo room hostel phone role year createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { users, pagination }, 'Users retrieved'));
});

// Update a user's role
export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { role } = req.body;
    const validRoles = ['student', 'admin', 'warden', 'mess_staff', 'guard', 'parent', 'helper'];

    if (!validRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role specified');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, 'User role updated successfully'));
});

// Permanently delete a user account and clean up related records
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user?._id?.toString()) {
        throw new ApiError(400, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    // Clean up all related records across collections
    const userId = req.params.id;
    await Promise.all([
        ParentStudent.deleteMany({ $or: [{ parent: userId }, { student: userId }] }),
        (await import('../models/GatePass')).default.deleteMany({ user: userId }),
        (await import('../models/GatePassLog')).default.deleteMany({ user: userId }),
        (await import('../models/Complaint')).default.deleteMany({ user: userId }),
        (await import('../models/Notification')).default.deleteMany({ user: userId }),
        (await import('../models/Emergency')).default.deleteMany({ user: userId }),
        (await import('../models/FoodRating')).default.deleteMany({ user: userId }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

// Retrieve all gate passes with status, student, and date filtering
export const getAllGatePasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { status, studentId, fromDate, toDate } = req.query;

    // Dynamic filter
    const filter: any = {};
    if (status) filter.status = status;
    if (studentId) filter.user = studentId;
    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
        if (toDate) filter.createdAt.$lte = new Date(toDate as string);
    }

    const GatePass = (await import('../models/GatePass')).default;

    const [passes, total] = await Promise.all([
        GatePass.find(filter)
            .populate('user', 'name rollNo room hostel email phone')
            .populate('approvedBy', 'name')
            .populate('parentApprovedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        GatePass.countDocuments(filter),
    ]);

    // Stats
    const stats = await GatePass.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination, stats }, 'All gate passes retrieved'));
});

// Retrieve system-wide statistics for the admin dashboard
export const getSystemStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const GatePass = (await import('../models/GatePass')).default;
    const Notice = (await import('../models/Notice')).default;
    const Complaint = (await import('../models/Complaint')).default;

    const [
        totalUsers,
        totalStudents,
        totalWardens,
        totalParents,
        totalAdmins,
        totalGuards,
        totalMessStaff,
        totalHelpers,
        totalPasses,
        approvedPasses,
        pendingPasses,
        rejectedPasses,
        totalNotices,
        pendingComplaints,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'warden' }),
        User.countDocuments({ role: 'parent' }),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'guard' }),
        User.countDocuments({ role: 'mess_staff' }),
        User.countDocuments({ role: 'helper' }),
        GatePass.countDocuments(),
        GatePass.countDocuments({ status: 'APPROVED' }),
        GatePass.countDocuments({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } }),
        GatePass.countDocuments({ status: 'REJECTED' }),
        Notice.countDocuments(),
        Complaint.countDocuments({ status: 'Pending' }),
    ]);

    return res.status(200).json(new ApiResponse(200, {
        users: {
            total: totalUsers,
            students: totalStudents,
            byRole: {
                student: totalStudents,
                warden: totalWardens,
                parent: totalParents,
                admin: totalAdmins,
                guard: totalGuards,
                mess_staff: totalMessStaff,
                helper: totalHelpers,
            },
        },
        gatePasses: {
            total: totalPasses,
            approved: approvedPasses,
            pending: pendingPasses,
            rejected: rejectedPasses,
        },
        notices: totalNotices,
        pendingComplaints: pendingComplaints,
    }, 'System statistics retrieved'));
});

// Cancel / reject any gate pass (admin override)
export const adminCancelGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const GatePass = (await import('../models/GatePass')).default;

    const pass = await GatePass.findById(req.params.id);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    // Admin can force reject any pass
    pass.status = 'REJECTED';
    pass.rejectionReason = `Cancelled by admin: ${req.user?.name}`;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass cancelled by admin'));
});

// Force approve a gate pass with QR code generation (admin override)
export const adminForceApproveGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const GatePass = (await import('../models/GatePass')).default;
    const { v4: uuidv4 } = await import('uuid');

    const pass = await GatePass.findById(req.params.id);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status === 'APPROVED') {
        throw new ApiError(400, 'Gate pass is already approved');
    }

    // Force approve with QR code
    pass.status = 'APPROVED';
    pass.qrValue = uuidv4();
    pass.approvedBy = req.user?._id;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass force-approved by admin'));
});

// Retrieve all notices with pagination and filtering
export const getAllNotices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { source, urgent, search } = req.query;

    const Notice = (await import('../models/Notice')).default;

    const filter: any = {};
    if (source) filter.source = source;
    if (urgent === 'true') filter.urgent = true;
    if (search) {
        const escaped = escapeRegex(search as string);
        filter.$or = [
            { title: { $regex: escaped, $options: 'i' } },
            { description: { $regex: escaped, $options: 'i' } },
        ];
    }

    const [notices, total] = await Promise.all([
        Notice.find(filter)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notice.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { notices, pagination }, 'All notices retrieved'));
});

// Delete a notice by ID (admin only)
export const adminDeleteNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const Notice = (await import('../models/Notice')).default;

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        throw new ApiError(404, 'Notice not found');
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, null, 'Notice deleted by admin'));
});

// Retrieve all complaints with pagination and status/category filters
export const getAllComplaints = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { status, category } = req.query;

    const Complaint = (await import('../models/Complaint')).default;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [complaints, total] = await Promise.all([
        Complaint.find(filter)
            .populate('user', 'name rollNo room hostel')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Complaint.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { complaints, pagination }, 'All complaints retrieved'));
});

// ==================== WARDEN CONTROLLERS ====================

// Retrieve live headcount and pending pass statistics for Warden Dashboard
export const getWardenDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const GatePass = (await import('../models/GatePass')).default;

    // Run all queries in parallel using aggregation
    const [
        totalStudents,
        studentsOutCount,
        pendingPassesCount,
    ] = await Promise.all([
        // Total students
        User.countDocuments({ role: 'student' }),

        // Students currently out (have exitTime, no entryTime - REGARDLESS of pass validity)
        GatePass.countDocuments({
            exitTime: { $exists: true, $ne: null },
            $or: [
                { entryTime: { $exists: false } },
                { entryTime: null }
            ]
        }),

        // Pending passes (PENDING_PARENT or PENDING_WARDEN)
        GatePass.countDocuments({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } }),
    ]);

    const studentsInside = totalStudents - studentsOutCount;

    return res.status(200).json(new ApiResponse(200, {
        totalStudents,
        studentsOut: studentsOutCount,
        studentsInside,
        pendingPasses: pendingPassesCount,
    }, 'Warden dashboard stats retrieved'));
});

// List students with live inside/outside status for Warden
export const getWardenStudentList = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { search } = req.query;

    // Build search filter
    const searchFilter: Record<string, unknown> = { role: 'student' };
    if (search && typeof search === 'string') {
        const escaped = escapeRegex(search);
        searchFilter.$or = [
            { name: { $regex: escaped, $options: 'i' } },
            { rollNo: { $regex: escaped, $options: 'i' } },
            { room: { $regex: escaped, $options: 'i' } },
        ];
    }

    const GatePass = (await import('../models/GatePass')).default;

    // Get students with pagination
    const [students, total] = await Promise.all([
        User.find(searchFilter)
            .select('name email rollNo room hostel phone avatar year')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(searchFilter),
    ]);

    // Get active passes for these students
    const studentIds = students.map(s => s._id);

    const activePasses = await GatePass.find({
        user: { $in: studentIds },
        status: 'APPROVED',
        exitTime: { $exists: true },
        entryTime: { $exists: false },
    }).select('user').lean();

    // Create lookup set
    const outSet = new Set(activePasses.map(p => p.user.toString()));

    // Enrich students with status
    const enrichedStudents = students.map(student => ({
        ...student,
        isOut: outSet.has(student._id.toString()),
    }));

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { students: enrichedStudents, pagination }, 'Students retrieved'));
});

// Get detailed profile and recent gate passes for a specific student
export const getStudentDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.params.id;

    const student = await User.findById(studentId).select('-password').lean();
    if (!student || student.role !== 'student') {
        throw new ApiError(404, 'Student not found');
    }

    const GatePass = (await import('../models/GatePass')).default;

    const [
        recentPasses,
        activePass,
    ] = await Promise.all([
        GatePass.find({ user: studentId }).sort({ createdAt: -1 }).limit(10),
        GatePass.findOne({
            user: studentId,
            status: 'APPROVED',
            exitTime: { $exists: true },
            entryTime: { $exists: false },
        }),
    ]);

    return res.status(200).json(new ApiResponse(200, {
        student,
        passes: {
            recent: recentPasses,
            isCurrentlyOut: !!activePass,
            activePass,
        },
    }, 'Student detail retrieved'));
});

// ==================== SYSTEM CONFIGURATION ====================

// Retrieve singleton system configuration
export const getSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    const SystemConfig = (await import('../models/SystemConfig')).default;

    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    return res.status(200).json(new ApiResponse(200, config, 'System configuration retrieved'));
});

// Update system configuration settings
export const updateSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { appConfig, emergencyContacts } = req.body;

    const SystemConfig = (await import('../models/SystemConfig')).default;
    const { logger } = await import('../utils/logger');

    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    // Track what changed for logging
    const changes: string[] = [];

    if (appConfig) {
        if (appConfig.maxGatePassDays !== undefined && appConfig.maxGatePassDays !== config.appConfig.maxGatePassDays) {
            changes.push(`appConfig.maxGatePassDays: ${config.appConfig.maxGatePassDays} → ${appConfig.maxGatePassDays}`);
            config.appConfig.maxGatePassDays = appConfig.maxGatePassDays;
        }
        if (appConfig.maxPendingPasses !== undefined && appConfig.maxPendingPasses !== config.appConfig.maxPendingPasses) {
            changes.push(`appConfig.maxPendingPasses: ${config.appConfig.maxPendingPasses} → ${appConfig.maxPendingPasses}`);
            config.appConfig.maxPendingPasses = appConfig.maxPendingPasses;
        }
    }

    if (emergencyContacts) {
        // Replace entire array if provided
        config.emergencyContacts = emergencyContacts;
        changes.push(`emergencyContacts: Updated with ${emergencyContacts.length} contact(s)`);
    }

    config.updatedAt = new Date();
    config.updatedBy = req.user?._id;

    await config.save();

    // Log the changes
    if (changes.length > 0) {
        logger.info(`🔧 System config updated by ${req.user?.name || 'Unknown'} (${req.user?.role})`, {
            userId: req.user?._id?.toString(),
            changes,
        });
    } else {
        logger.info(`🔧 System config save (no changes detected) by ${req.user?.name || 'Unknown'}`);
    }

    return res.status(200).json(new ApiResponse(200, config, 'System configuration updated'));
});

