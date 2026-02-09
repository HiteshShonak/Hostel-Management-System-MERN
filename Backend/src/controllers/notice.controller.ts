// src/controllers/notice.controller.ts
// Notice controller with production-grade patterns

import { Response } from 'express';
import Notice from '../models/Notice';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import cache, { CACHE_KEYS, CACHE_TTL } from '../utils/cache';

// @desc    Get all notices with pagination
// @route   GET /api/notices?page=1&limit=20
export const getNotices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const cacheKey = `${CACHE_KEYS.NOTICES}:${page}:${limit}`;

    // Try cache first (only for page 1)
    if (page === 1) {
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.status(200).json(new ApiResponse(200, cached, 'Notices retrieved (cached)'));
        }
    }

    const [notices, total] = await Promise.all([
        Notice.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notice.countDocuments(),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    const data = { notices, pagination };

    // Cache page 1 results
    if (page === 1) {
        await cache.set(cacheKey, data, CACHE_TTL.NOTICES);
    }

    return res.status(200).json(new ApiResponse(200, data, 'Notices retrieved'));
});

// @desc    Create notice (Warden or Mess Staff)
// @route   POST /api/notices
export const createNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, urgent } = req.body;

    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required');
    }

    // Determine source based on user role
    let source: 'warden' | 'mess_staff' | 'system' = 'warden';
    if (req.user?.role === 'mess_staff') {
        source = 'mess_staff';
    }

    const notice = await Notice.create({
        title,
        description,
        urgent: urgent || false,
        source,
        createdBy: req.user?._id,
    });

    // Auto-notify all students about the new notice
    const { notifyAllStudents } = await import('../services/notification.service');
    notifyAllStudents(
        'notice',
        urgent ? '🚨 Urgent Notice' : '📢 New Notice',
        title,
        '/notices',
        notice._id
    );

    // Invalidate notices cache
    await cache.deletePattern('notices:*');

    return res.status(201).json(new ApiResponse(201, notice, 'Notice created successfully'));
});

// @desc    Update notice (Owner or Admin)
// @route   PUT /api/notices/:id
export const updateNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, urgent } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
        throw new ApiError(404, 'Notice not found');
    }

    // Check ownership: only creator or admin can update
    const isOwner = notice.createdBy.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, 'You can only edit your own notices');
    }

    notice.title = title || notice.title;
    notice.description = description || notice.description;
    notice.urgent = urgent !== undefined ? urgent : notice.urgent;
    await notice.save();

    return res.status(200).json(new ApiResponse(200, notice, 'Notice updated successfully'));
});

// @desc    Delete notice (Owner or Admin)
// @route   DELETE /api/notices/:id
export const deleteNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
        throw new ApiError(404, 'Notice not found');
    }

    // Check ownership: only creator or admin can delete
    const isOwner = notice.createdBy.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, 'You can only delete your own notices');
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, null, 'Notice deleted successfully'));
});
