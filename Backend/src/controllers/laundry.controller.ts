// src/controllers/laundry.controller.ts
// Laundry controller with production-grade patterns

import { Response } from 'express';
import Laundry from '../models/Laundry';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// @desc    Get user's laundry history
// @route   GET /api/laundry
export const getLaundry = asyncHandler(async (req: AuthRequest, res: Response) => {
    const laundry = await Laundry.find({ user: req.user?._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, laundry, 'Laundry history retrieved'));
});

// @desc    Schedule laundry pickup
// @route   POST /api/laundry
export const scheduleLaundry = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { items, scheduledDate } = req.body;

    if (!items || !scheduledDate) {
        throw new ApiError(400, 'Items and scheduled date are required');
    }

    const laundry = await Laundry.create({
        user: req.user?._id,
        items,
        scheduledDate: new Date(scheduledDate),
    });

    return res.status(201).json(new ApiResponse(201, laundry, 'Laundry scheduled successfully'));
});

// @desc    Update laundry status (Admin)
// @route   PUT /api/laundry/:id/status
export const updateLaundryStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    const laundry = await Laundry.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!laundry) {
        throw new ApiError(404, 'Laundry record not found');
    }

    return res.status(200).json(new ApiResponse(200, laundry, 'Laundry status updated'));
});

// @desc    Mark laundry as collected
// @route   PUT /api/laundry/:id/collect
export const markCollected = asyncHandler(async (req: AuthRequest, res: Response) => {
    const laundry = await Laundry.findByIdAndUpdate(
        req.params.id,
        { status: 'Collected' },
        { new: true }
    );

    if (!laundry) {
        throw new ApiError(404, 'Laundry record not found');
    }

    return res.status(200).json(new ApiResponse(200, laundry, 'Laundry marked as collected'));
});
