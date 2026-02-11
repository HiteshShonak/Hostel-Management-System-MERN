// Admin controller for user management and parent-student linking

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

// @desc    Link a parent to a student
// @route   POST /api/admin/link-parent
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

// @desc    Remove a parent-student link (set to inactive)
// @route   DELETE /api/admin/link-parent/:id
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

// @desc    Get all parent-student links (paginated)
// @route   GET /api/admin/parent-links?page=1&limit=20
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

// @desc    Get all relations for a specific user
// @route   GET /api/admin/user/:id/relations
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
                    hostel: '$studentInfo.hostel'
                }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, { user, relations }, 'User relations retrieved'));
});

// @desc    Get all users (for admin to select when linking)
// @route   GET /api/admin/users?role=student&search=john&page=1&limit=20
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { role, search } = req.query;

    // Build filter
    const filter: any = {};
    if (role) {
        filter.role = role;
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('name email rollNo room hostel phone role createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { users, pagination }, 'Users retrieved'));
});

// @desc    Update user role (for admin)
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { role } = req.body;
    const validRoles = ['student', 'admin', 'warden', 'mess_staff', 'guard', 'parent'];

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

// @desc    Delete a user (admin only)
// @route   DELETE /api/admin/users/:id
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

    // Also clean up related parent-student links
    await ParentStudent.deleteMany({
        $or: [{ parent: req.params.id }, { student: req.params.id }]
    });

    return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

// @desc    Get all gate passes (admin view)
// @route   GET /api/admin/gate-passes?status=PENDING_WARDEN&page=1&limit=20
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

// @desc    Get all attendance records (admin view)
// @route   GET /api/admin/attendance?date=2024-01-15&page=1&limit=50
export const getAllAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 50);
    const { date, studentId, hostel } = req.query;

    const Attendance = (await import('../models/Attendance')).default;

    // Build filter with optional joins
    const matchStage: any = {};
    if (studentId) matchStage.user = new Types.ObjectId(studentId as string);
    if (date) {
        // Convert to IST timezone
        const targetDate = toISTDate(new Date(date as string));
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        matchStage.date = { $gte: targetDate, $lt: nextDay };
    }

    // Use aggregation for hostel filtering
    const pipeline: any[] = [
        { $match: matchStage },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
    ];

    if (hostel) {
        pipeline.push({ $match: { 'userInfo.hostel': hostel } });
    }

    pipeline.push(
        { $sort: { markedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                _id: 1,
                date: 1,
                markedAt: 1,
                location: 1,
                user: {
                    _id: '$userInfo._id',
                    name: '$userInfo.name',
                    rollNo: '$userInfo.rollNo',
                    room: '$userInfo.room',
                    hostel: '$userInfo.hostel',
                }
            }
        }
    );

    const attendance = await Attendance.aggregate(pipeline);
    const total = await Attendance.countDocuments(matchStage);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { attendance, pagination }, 'All attendance records retrieved'));
});

// @desc    Get system statistics for admin dashboard
// @route   GET /api/admin/stats
export const getSystemStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Use IST for today
    const today = getISTDate();

    // Calculate start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const GatePass = (await import('../models/GatePass')).default;
    const Attendance = (await import('../models/Attendance')).default;
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
        totalPasses,
        approvedPasses,
        pendingPasses,
        rejectedPasses,
        monthlyAttendance,
        todayAttendance,
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
        GatePass.countDocuments(),
        GatePass.countDocuments({ status: 'APPROVED' }),
        GatePass.countDocuments({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } }),
        GatePass.countDocuments({ status: 'REJECTED' }),
        Attendance.countDocuments({ date: { $gte: startOfMonth } }),
        Attendance.countDocuments({ date: today }),
        Notice.countDocuments(),
        Complaint.countDocuments({ status: 'Pending' }),
    ]);

    // Calculate average attendance for the month
    const daysInMonth = today.getDate();
    const expectedRecords = totalStudents * daysInMonth;
    const averagePercentage = expectedRecords > 0
        ? Math.round((monthlyAttendance / expectedRecords) * 100)
        : 0;

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
            },
        },
        gatePasses: {
            total: totalPasses,
            approved: approvedPasses,
            pending: pendingPasses,
            rejected: rejectedPasses,
        },
        attendance: {
            monthlyRecords: monthlyAttendance,
            todayRecords: todayAttendance,
            averagePercentage: averagePercentage,
            totalStudents: totalStudents,
        },
        notices: totalNotices,
        pendingComplaints: pendingComplaints,
    }, 'System statistics retrieved'));
});

// @desc    Admin: Cancel any gate pass
// @route   DELETE /api/admin/gate-passes/:id
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

// @desc    Admin: Force approve any gate pass (bypasses parent/warden flow)
// @route   PUT /api/admin/gate-passes/:id/approve
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

// @desc    Admin: Get all notices (with filters)
// @route   GET /api/admin/notices?source=warden&page=1&limit=20
export const getAllNotices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { source, urgent, search } = req.query;

    const Notice = (await import('../models/Notice')).default;

    const filter: any = {};
    if (source) filter.source = source;
    if (urgent === 'true') filter.urgent = true;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
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

// @desc    Admin: Delete any notice
// @route   DELETE /api/admin/notices/:id  
export const adminDeleteNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const Notice = (await import('../models/Notice')).default;

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        throw new ApiError(404, 'Notice not found');
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, null, 'Notice deleted by admin'));
});

// @desc    Admin: Get all complaints
// @route   GET /api/admin/complaints?status=Pending&page=1
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

// ==================== WARDEN DASHBOARD ENDPOINTS ====================

// @desc    Get warden dashboard statistics
// @route   GET /api/admin/warden/dashboard-stats
export const getWardenDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Use IST for today
    const today = getISTDate();

    const Attendance = (await import('../models/Attendance')).default;
    const GatePass = (await import('../models/GatePass')).default;

    // Run all queries in parallel using aggregation
    const [
        totalStudents,
        studentsOutCount,
        todayAttendanceCount,
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

        // Today's attendance count
        Attendance.countDocuments({ date: today }),

        // Pending passes (PENDING_PARENT or PENDING_WARDEN)
        GatePass.countDocuments({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } }),
    ]);

    const studentsInside = totalStudents - studentsOutCount;
    const attendancePercentage = totalStudents > 0
        ? Math.round((todayAttendanceCount / totalStudents) * 100)
        : 0;

    return res.status(200).json(new ApiResponse(200, {
        totalStudents,
        studentsOut: studentsOutCount,
        studentsInside,
        todayAttendance: todayAttendanceCount,
        attendancePercentage,
        pendingPasses: pendingPassesCount,
    }, 'Warden dashboard stats retrieved'));
});

// @desc    Get all students with their current status
// @route   GET /api/admin/warden/students?search=john&page=1
export const getWardenStudentList = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { search } = req.query;

    // Use IST for today
    const today = getISTDate();

    // Build search filter
    const searchFilter: Record<string, unknown> = { role: 'student' };
    if (search && typeof search === 'string') {
        searchFilter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } },
            { room: { $regex: search, $options: 'i' } },
        ];
    }

    const Attendance = (await import('../models/Attendance')).default;
    const GatePass = (await import('../models/GatePass')).default;

    // Get students with pagination
    const [students, total] = await Promise.all([
        User.find(searchFilter)
            .select('name email rollNo room hostel phone avatar')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(searchFilter),
    ]);

    // Get today's attendance and active passes for these students
    const studentIds = students.map(s => s._id);

    const [todayAttendance, activePasses] = await Promise.all([
        Attendance.find({ user: { $in: studentIds }, date: today }).select('user').lean(),
        GatePass.find({
            user: { $in: studentIds },
            status: 'APPROVED',
            exitTime: { $exists: true },
            entryTime: { $exists: false },
        }).select('user').lean(),
    ]);

    // Create lookup sets
    const attendanceSet = new Set(todayAttendance.map(a => a.user.toString()));
    const outSet = new Set(activePasses.map(p => p.user.toString()));

    // Enrich students with status
    const enrichedStudents = students.map(student => ({
        ...student,
        markedAttendanceToday: attendanceSet.has(student._id.toString()),
        isOut: outSet.has(student._id.toString()),
    }));

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { students: enrichedStudents, pagination }, 'Students retrieved'));
});

// @desc    Get detailed student info with attendance and pass history
// @route   GET /api/admin/warden/students/:id
export const getStudentDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.params.id;

    const student = await User.findById(studentId).select('-password').lean();
    if (!student || student.role !== 'student') {
        throw new ApiError(404, 'Student not found');
    }

    // Use IST for today
    const today = getISTDate();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const Attendance = (await import('../models/Attendance')).default;
    const GatePass = (await import('../models/GatePass')).default;

    // Get attendance and pass history in parallel
    const [
        todayAttendance,
        monthlyAttendance,
        recentPasses,
        activePass,
    ] = await Promise.all([
        Attendance.findOne({ user: studentId, date: today }),
        Attendance.find({ user: studentId, date: { $gte: monthStart } }).sort({ date: -1 }).limit(31),
        GatePass.find({ user: studentId }).sort({ createdAt: -1 }).limit(10),
        GatePass.findOne({
            user: studentId,
            status: 'APPROVED',
            exitTime: { $exists: true },
            entryTime: { $exists: false },
        }),
    ]);

    // Calculate attendance percentage
    const daysInMonth = today.getDate();
    const attendancePercentage = daysInMonth > 0
        ? Math.round((monthlyAttendance.length / daysInMonth) * 100)
        : 0;

    return res.status(200).json(new ApiResponse(200, {
        student,
        attendance: {
            markedToday: !!todayAttendance,
            todayRecord: todayAttendance,
            monthlyRecords: monthlyAttendance,
            monthlyPercentage: attendancePercentage,
            presentDays: monthlyAttendance.length,
            totalDays: daysInMonth,
        },
        passes: {
            recent: recentPasses,
            isCurrentlyOut: !!activePass,
            activePass,
        },
    }, 'Student detail retrieved'));
});

// @desc    Warden marks attendance for a student manually
// @route   POST /api/admin/warden/mark-attendance/:studentId
export const wardenMarkAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.params.studentId;

    // Validate student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
        throw new ApiError(404, 'Student not found');
    }

    // Use IST for today
    const today = getISTDate();

    const Attendance = (await import('../models/Attendance')).default;

    // Check if already marked
    const existing = await Attendance.findOne({ user: studentId, date: today });
    if (existing) {
        throw new ApiError(409, 'Attendance already marked for this student today');
    }

    // Create attendance record with warden info
    const attendance = await Attendance.create({
        user: studentId,
        date: today,
        markedAt: new Date(),
        markedByWarden: req.user?._id,
        location: {
            latitude: 0,
            longitude: 0,
            distanceFromHostel: 0,
            manualEntry: true,
        },
    });

    return res.status(201).json(new ApiResponse(201, attendance, `Attendance marked for ${student.name}`));
});

// ==================== ADMIN SYSTEM CONFIGURATION ====================

// @desc    Get current system configuration
// @route   GET /api/admin/config
export const getSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    const SystemConfig = (await import('../models/SystemConfig')).default;

    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    return res.status(200).json(new ApiResponse(200, config, 'System configuration retrieved'));
});

// @desc    Update system configuration
// @route   PUT /api/admin/config
export const updateSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { hostelCoords, geofenceRadiusMeters, attendanceWindow, appConfig } = req.body;

    const SystemConfig = (await import('../models/SystemConfig')).default;

    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    // Update fields if provided
    if (hostelCoords) {
        if (hostelCoords.latitude !== undefined) config.hostelCoords.latitude = hostelCoords.latitude;
        if (hostelCoords.longitude !== undefined) config.hostelCoords.longitude = hostelCoords.longitude;
        if (hostelCoords.name) config.hostelCoords.name = hostelCoords.name;
    }

    if (geofenceRadiusMeters !== undefined) {
        config.geofenceRadiusMeters = geofenceRadiusMeters;
    }

    if (attendanceWindow) {
        if (attendanceWindow.enabled !== undefined) config.attendanceWindow.enabled = attendanceWindow.enabled;
        if (attendanceWindow.startHour !== undefined) config.attendanceWindow.startHour = attendanceWindow.startHour;
        if (attendanceWindow.endHour !== undefined) config.attendanceWindow.endHour = attendanceWindow.endHour;
        if (attendanceWindow.timezone) config.attendanceWindow.timezone = attendanceWindow.timezone;
    }

    if (appConfig) {
        if (appConfig.maxGatePassDays !== undefined) config.appConfig.maxGatePassDays = appConfig.maxGatePassDays;
        if (appConfig.maxPendingPasses !== undefined) config.appConfig.maxPendingPasses = appConfig.maxPendingPasses;
        if (appConfig.attendanceGracePeriod !== undefined) config.appConfig.attendanceGracePeriod = appConfig.attendanceGracePeriod;
    }

    config.updatedAt = new Date();
    config.updatedBy = req.user?._id;

    await config.save();

    return res.status(200).json(new ApiResponse(200, config, 'System configuration updated'));
});

