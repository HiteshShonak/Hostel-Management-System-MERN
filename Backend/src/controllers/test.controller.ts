// src/controllers/test.controller.ts
// Test controller for push notifications

import { Response } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { sendPushToUser, sendPushToRole } from '../services/push-notification.service';
import User from '../models/User';
import { logger } from '../utils/logger';

// @desc    Test push notification to self
// @route   POST /api/test/push-to-me
export const testPushToMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    // Get user's push token
    const user = await User.findById(userId);

    if (!user?.pushToken) {
        return res.status(200).json(new ApiResponse(200, {
            success: false,
            message: 'No push token registered for your account',
            userId: userId.toString()
        }, 'Push token not found'));
    }

    logger.info('Testing push notification', {
        userId: userId.toString(),
        pushToken: user.pushToken
    });

    // Send test notification
    await sendPushToUser(
        userId,
        '🧪 Test Notification',
        'If you see this, push notifications are working! 🎉',
        {
            type: 'system',
            testData: 'This is a test from backend'
        }
    );

    return res.status(200).json(new ApiResponse(200, {
        success: true,
        message: 'Test notification sent',
        userId: userId.toString(),
        pushToken: user.pushToken
    }, 'Test notification sent successfully'));
});

// @desc    Test push notification to all students
// @route   POST /api/test/push-to-students
export const testPushToAllStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Only admins/wardens can test
    if (req.user?.role !== 'admin' && req.user?.role !== 'warden') {
        throw new ApiError(403, 'Only admins and wardens can send test notifications');
    }

    logger.info('Testing push to all students', { triggeredBy: req.user?._id });

    await sendPushToRole(
        'student',
        '📢 Test Announcement',
        'This is a test notification sent to all students',
        {
            type: 'system',
            testData: 'Broadcast test'
        }
    );

    const studentCount = await User.countDocuments({ role: 'student', pushToken: { $exists: true, $ne: null } });

    return res.status(200).json(new ApiResponse(200, {
        success: true,
        message: 'Test notification sent to all students',
        studentsWithTokens: studentCount
    }, 'Broadcast test sent successfully'));
});

// @desc    Get push token status
// @route   GET /api/test/push-status
export const getPushStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }

    const user = await User.findById(userId);

    return res.status(200).json(new ApiResponse(200, {
        userId: userId.toString(),
        hasPushToken: !!user?.pushToken,
        pushToken: user?.pushToken || null,
        pushTokenUpdatedAt: user?.pushTokenUpdatedAt || null
    }, 'Push token status retrieved'));
});
