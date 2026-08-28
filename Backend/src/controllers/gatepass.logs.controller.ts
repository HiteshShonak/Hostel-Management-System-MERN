// src/controllers/gatepass.logs.controller.ts
// Headcount monitoring, recent entries, and activity logs query handlers

import { Response } from 'express';
import GatePass from '../models/GatePass';
import GatePassLog from '../models/GatePassLog';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { getISTDate } from '../utils/timezone';

// get list of students currently away - GET /api/gatepass/students-out
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
        isExpired: new Date(pass.toDate) < now, // Student is outside and pass expired
    }));

    return res.status(200).json(new ApiResponse(200, passesWithStatus, 'Students currently outside'));
});

// get list of students who came back today - GET /api/gatepass/recent-entries
export const getRecentEntries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = getISTDate();

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
            lateDuration = hours > 0 ? `${hours}h ${mins}m late` : `${mins}m late`;
        }

        return {
            ...pass.toObject(),
            isLate,
            lateDuration
        };
    });

    return res.status(200).json(new ApiResponse(200, passesWithStatus, 'Recent entries retrieved'));
});

// get full activity history (entry/exit logs) - GET /api/gatepass/logs
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
