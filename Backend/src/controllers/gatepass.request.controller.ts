// src/controllers/gatepass.request.controller.ts
// Gate pass request creation, active pass check, and student pass listing handlers

import { Response } from 'express';
import GatePass from '../models/GatePass';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import SystemConfig from '../models/SystemConfig';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { getISTDate, toISTDate } from '../utils/timezone';
import { createNotification } from '../services/notification.service';

// get my gate passes - GET /api/gatepass
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

// check if i have an active pass right now - GET /api/gatepass/current
export const getCurrentPass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const now = new Date();
    const currentPass = await GatePass.findOne({
        user: req.user?._id,
        status: 'APPROVED',
        fromDate: { $lte: now },
        toDate: { $gte: now },
    });

    const isCurrentlyOut = currentPass ? !!(currentPass.exitTime && !currentPass.entryTime) : false;
    return res.status(200).json(new ApiResponse(200, { pass: currentPass, isCurrentlyOut }, 'Current pass retrieved'));
});

// request a new gate pass - POST /api/gatepass
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

    // make sure date isn't in the past
    const today = getISTDate();
    const fromDateOnly = toISTDate(new Date(from));
    if (fromDateOnly < today) {
        throw new ApiError(400, 'From date cannot be in the past');
    }

    // check app rules from config
    const config = await SystemConfig.getConfig();
    const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > config.appConfig.maxGatePassDays) {
        throw new ApiError(400, `Gate pass cannot exceed ${config.appConfig.maxGatePassDays} days`);
    }

    // check if student has too many pending passes
    const pendingCount = await GatePass.countDocuments({
        user: req.user?._id,
        status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] },
    });
    if (pendingCount >= config.appConfig.maxPendingPasses) {
        throw new ApiError(400, `You can only have ${config.appConfig.maxPendingPasses} pending passes at a time`);
    }

    // prevent overlapping passes
    const existingPass = await GatePass.findOne({
        user: req.user?._id,
        status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN', 'APPROVED'] },
        $or: [{ fromDate: { $lte: to }, toDate: { $gte: from } }],
    });
    if (existingPass) {
        throw new ApiError(400, 'You already have a pass for this period');
    }

    // Check if student has an active parent link
    const hasParentLink = await ParentStudent.findOne({
        student: req.user?._id,
        status: 'active'
    });

    const initialStatus = hasParentLink ? 'PENDING_PARENT' : 'PENDING_WARDEN';
    const pass = await GatePass.create({
        user: req.user?._id,
        reason,
        fromDate: from,
        toDate: to,
        status: initialStatus
    });

    // send notifications to right people
    if (initialStatus === 'PENDING_WARDEN') {
        const wardens = await User.find({ role: 'warden' }).select('_id');
        for (const warden of wardens) {
            createNotification({
                userId: warden._id,
                type: 'gatepass',
                title: 'New Gate Pass Pending',
                message: `Gate pass from ${req.user?.name} is waiting for approval.`,
                relatedId: pass._id,
            });
        }
    } else if (hasParentLink && req.user?._id) {
        const parentLinkData = await ParentStudent.findOne({
            student: req.user._id,
            status: 'active'
        }).populate('parent');

        if (parentLinkData?.parent) {
            createNotification({
                userId: (parentLinkData.parent as any)._id,
                type: 'gatepass',
                title: 'Gate Pass Approval Needed',
                message: `${req.user.name} has requested a gate pass.`,
                relatedId: pass._id,
            });
        }
    } else if (req.user?._id) {
        createNotification({
            userId: req.user._id,
            type: 'gatepass',
            title: 'Gate Pass Submitted',
            message: 'Your gate pass request has been sent to your parent for approval.',
            relatedId: pass._id,
        });
    }

    return res.status(201).json(new ApiResponse(201, pass, 'Gate pass requested successfully'));
});
