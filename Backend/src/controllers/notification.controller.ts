// src/controllers/notification.controller.ts
// Notification controller with production-grade patterns

import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// @desc    Get user's notifications with pagination
// @route   GET /api/notifications?page=1&limit=20
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [notifications, total] = await Promise.all([
        Notification.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notification.countDocuments({ user: req.user?._id }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);

    return res.status(200).json(new ApiResponse(200, { notifications, pagination }, 'Notifications retrieved'));
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const count = await Notification.countDocuments({ user: req.user?._id, read: false });
    return res.status(200).json(new ApiResponse(200, { count }, 'Unread count retrieved'));
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user?._id },
        { read: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    return res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    await Notification.updateMany(
        { user: req.user?._id, read: false },
        { read: true }
    );

    return res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user?._id,
    });

    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    return res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});
