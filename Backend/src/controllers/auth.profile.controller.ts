// src/controllers/auth.profile.controller.ts
// Profile retrieval, profile updates, password changes, and push token registration handlers

import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

// get current user profile - GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(new ApiResponse(200, user, 'User profile retrieved'));
});

// update profile details - PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, phone, room, year } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (room !== undefined) updateData.room = room;
    if (year !== undefined && req.user?.role === 'student') updateData.year = year;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

// change password - PUT /api/auth/password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Please provide current password and new password');
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, 'New password must be at least 6 characters');
    }

    // get user with password to verify
    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // verify old password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect');
    }

    // update to new password (hashed automatically by pre-save hook)
    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

// update push token for notifications - PUT /api/auth/push-token
export const updatePushToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { pushToken } = req.body;

    if (!pushToken) {
        throw new ApiError(400, 'Push token is required');
    }

    // check expo token format
    if (!pushToken.startsWith('ExponentPushToken[')) {
        throw new ApiError(400, 'Invalid push token format');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            pushToken,
            pushTokenUpdatedAt: new Date()
        },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    logger.info('Push token updated', { userId: user._id });
    return res.status(200).json(new ApiResponse(200, { pushToken: user.pushToken }, 'Push token updated successfully'));
});
