// src/controllers/admin.warden.controller.ts
// Warden dashboard statistics and student monitoring handlers

import { Response } from 'express';
import User from '../models/User';
import GatePass from '../models/GatePass';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Retrieve live headcount and pending pass statistics for Warden Dashboard
export const getWardenDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
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
