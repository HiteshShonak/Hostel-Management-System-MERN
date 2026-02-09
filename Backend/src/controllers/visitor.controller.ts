// src/controllers/visitor.controller.ts
// Visitor controller with production-grade patterns

import { Response } from 'express';
import Visitor from '../models/Visitor';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// @desc    Get user's visitors (paginated)
// @route   GET /api/visitors?page=1&limit=10
export const getVisitors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 10);

    const [visitors, total] = await Promise.all([
        Visitor.find({ user: req.user?._id }).sort({ expectedDate: -1, createdAt: -1 }).skip(skip).limit(limit),
        Visitor.countDocuments({ user: req.user?._id }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { visitors, pagination }, 'Visitors retrieved'));
});

// @desc    Register new visitor
// @route   POST /api/visitors
export const registerVisitor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, relation, phone, expectedDate, expectedTime } = req.body;

    if (!name || !relation || !phone || !expectedDate || !expectedTime) {
        throw new ApiError(400, 'Name, relation, phone, expected date, and expected time are required');
    }

    const visitor = await Visitor.create({
        user: req.user?._id,
        name,
        relation,
        phone,
        expectedDate,
        expectedTime,
    });

    return res.status(201).json(new ApiResponse(201, visitor, 'Visitor registered successfully'));
});

// @desc    Check-in visitor (Staff)
// @route   PUT /api/visitors/:id/checkin
export const checkInVisitor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findByIdAndUpdate(
        req.params.id,
        { status: 'Checked-In', checkInTime: new Date() },
        { new: true }
    );

    if (!visitor) {
        throw new ApiError(404, 'Visitor not found');
    }

    // Notify the student
    const { createNotification } = await import('../services/notification.service');
    createNotification({
        userId: visitor.user,
        type: 'visitor',
        title: '👥 Visitor Checked In',
        message: `Your visitor "${visitor.name}" has checked in.`,
        link: '/visitors',
        relatedId: visitor._id,
    });

    return res.status(200).json(new ApiResponse(200, visitor, 'Visitor checked in'));
});

// @desc    Check-out visitor (Staff)
// @route   PUT /api/visitors/:id/checkout
export const checkOutVisitor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findByIdAndUpdate(
        req.params.id,
        { status: 'Visited', checkOutTime: new Date() },
        { new: true }
    );

    if (!visitor) {
        throw new ApiError(404, 'Visitor not found');
    }

    // Notify the student
    const { createNotification } = await import('../services/notification.service');
    createNotification({
        userId: visitor.user,
        type: 'visitor',
        title: '👋 Visitor Checked Out',
        message: `Your visitor "${visitor.name}" has checked out.`,
        link: '/visitors',
        relatedId: visitor._id,
    });

    return res.status(200).json(new ApiResponse(200, visitor, 'Visitor checked out'));
});
