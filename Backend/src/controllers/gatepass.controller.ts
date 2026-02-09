// src/controllers/gatepass.controller.ts
// Gate Pass controller with production-grade patterns

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import GatePass from '../models/GatePass';
import GatePassLog from '../models/GatePassLog';
import User from '../models/User';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { createNotification } from '../services/notification.service';

// @desc    Get user's gate passes (paginated)
// @route   GET /api/gatepass?page=1&limit=10
export const getGatePasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 10);

    let query: any = { user: req.user?._id };

    if (req.user?.role === 'parent') {
        const students = await User.find({ parentEmail: req.user.email }).select('_id');
        const studentIds = students.map(s => s._id);
        query = { user: { $in: studentIds } };
    }

    const [passes, total] = await Promise.all([
        GatePass.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name rollNo room'),
        GatePass.countDocuments(query),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination }, 'Gate passes retrieved'));
});

// @desc    Get current active gate pass
// @route   GET /api/gatepass/current
export const getCurrentPass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const now = new Date();
    const currentPass = await GatePass.findOne({
        user: req.user?._id,
        status: 'APPROVED',
        fromDate: { $lte: now },
        toDate: { $gte: now },
    });

    return res.status(200).json(new ApiResponse(200, currentPass, 'Current pass retrieved'));
});

// @desc    Request new gate pass
// @route   POST /api/gatepass
export const requestGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { reason, fromDate, toDate } = req.body;

    if (!reason || !fromDate || !toDate) {
        throw new ApiError(400, 'Please provide reason, from date, and to date');
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        throw new ApiError(400, 'Invalid date format');
    }

    if (from >= to) {
        throw new ApiError(400, 'From date must be before to date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDateOnly = new Date(from);
    fromDateOnly.setHours(0, 0, 0, 0);

    if (fromDateOnly < today) {
        throw new ApiError(400, 'From date cannot be in the past');
    }

    // Check for overlapping pending/approved passes
    const existingPass = await GatePass.findOne({
        user: req.user?._id,
        status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN', 'APPROVED'] },
        $or: [{ fromDate: { $lte: to }, toDate: { $gte: from } }],
    });

    if (existingPass) {
        throw new ApiError(400, 'You already have a pass for this period');
    }

    const pass = await GatePass.create({
        user: req.user?._id,
        reason,
        fromDate: from,
        toDate: to,
    });

    return res.status(201).json(new ApiResponse(201, pass, 'Gate pass requested successfully'));
});

// @desc    Get all pending passes (Warden)
// @route   GET /api/gatepass/pending
export const getPendingPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const passes = await GatePass.find({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } })
        .populate('user', 'name rollNo room hostel phone')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, passes, 'Pending passes retrieved'));
});

// @desc    Get all passes (Warden) - paginated
// @route   GET /api/gatepass/all?page=1&limit=20
export const getAllPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [passes, total] = await Promise.all([
        GatePass.find()
            .populate('user', 'name rollNo room hostel phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        GatePass.countDocuments(),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination }, 'All passes retrieved'));
});

// @desc    Approve gate pass (Warden)
// @route   PUT /api/gatepass/:id/approve
export const approveGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status !== 'PENDING_WARDEN' && req.user?.role !== 'admin') {
        throw new ApiError(400, 'Gate pass is not pending warden approval');
    }

    pass.status = 'APPROVED';
    pass.qrValue = `GP-${uuidv4().slice(0, 8).toUpperCase()}`;
    pass.approvedBy = req.user?._id;
    await pass.save();

    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: '✅ Gate Pass Approved',
        message: 'Your gate pass has been approved. Show the QR code at the gate.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass approved'));
});

// @desc    Reject gate pass (Warden)
// @route   PUT /api/gatepass/:id/reject
export const rejectGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status !== 'PENDING_WARDEN' && req.user?.role !== 'admin') {
        throw new ApiError(400, 'Gate pass is not pending warden approval');
    }

    pass.status = 'REJECTED';
    await pass.save();

    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: '❌ Gate Pass Rejected',
        message: 'Your gate pass request has been rejected.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass rejected'));
});

// @desc    Validate gate pass QR (Staff)
// @route   POST /api/gatepass/validate
export const validateGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { qrValue } = req.body;

    if (!qrValue) {
        throw new ApiError(400, 'QR value is required');
    }

    const pass = await GatePass.findOne({ qrValue, status: 'APPROVED' })
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        return res.status(200).json(new ApiResponse(200, { valid: false, error: 'Invalid or expired pass' }, 'Validation failed'));
    }

    const now = new Date();

    // Check if pass is expired (toDate already passed)
    if (now > new Date(pass.toDate)) {
        // Check if student is outside (exitTime but no entryTime)
        const isStudentOutside = pass.exitTime && !pass.entryTime;

        return res.status(200).json(new ApiResponse(200, {
            valid: false,
            error: isStudentOutside ? 'Pass expired - Student is still outside!' : 'Pass has expired',
            status: 'EXPIRED',
            isExpired: true,
            isStudentOutside: isStudentOutside,
            pass: pass, // Include pass details for showing student info
        }, 'Pass expired'));
    }

    // Check if pass not yet started (before fromDate)
    if (now < new Date(pass.fromDate)) {
        return res.status(200).json(new ApiResponse(200, {
            valid: false,
            error: 'Pass not valid yet - starts on ' + new Date(pass.fromDate).toLocaleDateString(),
            status: 'NOT_STARTED',
            pass: pass,
        }, 'Pass not started'));
    }

    pass.validatedBy = req.user?._id;
    pass.validatedAt = now;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, { valid: true, pass }, 'Gate pass validated'));
});

// @desc    Mark student exit (Guard scans and lets student out)
// @route   PUT /api/gatepass/:id/exit
export const markExit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id)
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status !== 'APPROVED') {
        throw new ApiError(400, 'Gate pass is not approved');
    }

    const now = new Date();
    if (now > new Date(pass.toDate)) {
        throw new ApiError(400, 'Gate pass has expired');
    }

    if (pass.exitTime && !pass.entryTime) {
        throw new ApiError(400, 'Student already exited and has not returned yet');
    }

    pass.exitTime = now;
    pass.exitMarkedBy = req.user?._id;
    pass.entryTime = undefined;
    pass.entryMarkedBy = undefined;
    await pass.save();

    await GatePassLog.create({
        gatePass: pass._id,
        user: pass.user._id || pass.user,
        action: 'EXIT',
        timestamp: now,
        markedBy: req.user?._id,
    });

    createNotification({
        userId: pass.user._id || pass.user,
        type: 'gatepass',
        title: '🚶 Exit Recorded',
        message: 'Your exit has been recorded. Have a safe trip!',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Student exit marked successfully'));
});

// @desc    Mark student entry (Guard scans when student returns)
// @route   PUT /api/gatepass/:id/entry
export const markEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id)
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (!pass.exitTime) {
        throw new ApiError(400, 'Student has not exited yet');
    }

    if (pass.entryTime) {
        throw new ApiError(400, 'Student already inside. Need to exit first.');
    }

    const now = new Date();
    const toDate = new Date(pass.toDate);

    // Check if student is returning late
    const isLate = now > toDate;
    let lateNote = '';

    if (isLate) {
        const lateByMs = now.getTime() - toDate.getTime();
        const lateByMinutes = Math.floor(lateByMs / (1000 * 60));
        const hours = Math.floor(lateByMinutes / 60);
        const minutes = lateByMinutes % 60;

        if (hours > 0) {
            lateNote = `Student returned ${hours}h ${minutes}m late`;
        } else {
            lateNote = `Student returned ${minutes}m late`;
        }
    }

    pass.entryTime = now;
    pass.entryMarkedBy = req.user?._id;
    await pass.save();

    // Create log entry with late flag and note
    await GatePassLog.create({
        gatePass: pass._id,
        user: pass.user._id || pass.user,
        action: 'ENTRY',
        timestamp: now,
        markedBy: req.user?._id,
        isLate: isLate,
        note: isLate ? lateNote : undefined,
    });

    createNotification({
        userId: pass.user._id || pass.user,
        type: 'gatepass',
        title: isLate ? '⏰ Late Return Recorded' : '🏠 Welcome Back!',
        message: isLate ? `${lateNote}. Entry has been recorded.` : 'Your return has been recorded.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    // Return pass with late status for frontend
    const response = {
        ...pass.toObject(),
        isLate: isLate,
        lateNote: isLate ? lateNote : undefined,
    };

    return res.status(200).json(new ApiResponse(200, response, isLate ? 'Late entry marked successfully' : 'Student entry marked successfully'));
});

// @desc    Get students currently outside (have exitTime but no entryTime)
// @route   GET /api/gatepass/students-out
export const getStudentsOut = asyncHandler(async (req: AuthRequest, res: Response) => {
    const passes = await GatePass.find({
        exitTime: { $exists: true, $ne: null },
        $or: [
            { entryTime: { $exists: false } },
            { entryTime: null }
        ]
    })
        .populate('user', 'name rollNo room hostel phone')
        .populate('exitMarkedBy', 'name')
        .sort({ exitTime: -1 });

    const now = new Date();
    const passesWithStatus = passes.map(pass => ({
        ...pass.toObject(),
        isPassValid: pass.status === 'APPROVED' && new Date(pass.toDate) >= now,
        isExpired: new Date(pass.toDate) < now  // Student is outside and pass expired
    }));

    return res.status(200).json(new ApiResponse(200, passesWithStatus, 'Students currently outside'));
});

// @desc    Get recent entries (students who returned today)
// @route   GET /api/gatepass/recent-entries
export const getRecentEntries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const passes = await GatePass.find({
        entryTime: { $gte: today }
    })
        .populate('user', 'name rollNo room hostel phone')
        .populate('entryMarkedBy', 'name')
        .sort({ entryTime: -1 });

    const passesWithStatus = passes.map(pass => {
        const isLate = pass.entryTime && new Date(pass.entryTime) > new Date(pass.toDate);
        let lateDuration = '';

        if (isLate && pass.entryTime) {
            const diff = new Date(pass.entryTime).getTime() - new Date(pass.toDate).getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (hours > 0) lateDuration = `${hours}h ${mins}m late`;
            else lateDuration = `${mins}m late`;
        }

        return {
            ...pass.toObject(),
            isLate,
            lateDuration
        };
    });

    return res.status(200).json(new ApiResponse(200, passesWithStatus, 'Recent entries retrieved'));
});

// @desc    Get activity logs (all entry/exit events)
// @route   GET /api/gatepass/logs?page=1&limit=50
export const getActivityLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 50);

    const [logs, total] = await Promise.all([
        GatePassLog.find()
            .populate('user', 'name rollNo room hostel phone')
            .populate('markedBy', 'name')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit),
        GatePassLog.countDocuments(),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { logs, pagination }, 'Activity logs retrieved'));
});
