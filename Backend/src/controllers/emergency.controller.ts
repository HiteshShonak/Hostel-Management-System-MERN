// handles sos alerts and emergency numbers

import { Response } from 'express';
import Emergency from '../models/Emergency';
import SystemConfig from '../models/SystemConfig';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// send an sos
export const sendSOS = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, message, location } = req.body;

    if (!type) {
        throw new ApiError(400, 'Emergency type is required');
    }

    const emergency = await Emergency.create({
        user: req.user?._id,
        type,
        message: message || '',
        location: location || '',
    });

    // notify all wardens immediately
    const { sendPushToRole } = await import('../services/push-notification.service');
    sendPushToRole(
        'warden',
        `🚨 Emergency Alert - ${type}`,
        `${req.user?.name} (${req.user?.room}) sent SOS: ${message || 'No message'}`,
        {
            type: 'emergency',
            emergencyId: emergency._id.toString(),
            studentId: req.user?._id.toString(),
            location: location || '',
        }
    ).catch(err => {
        // don't fail request if push doesn't work
        console.error('Failed to send emergency push:', err);
    });

    return res.status(201).json(new ApiResponse(201, {
        success: true,
        message: 'SOS alert sent successfully. Help is on the way.',
        alertId: emergency._id,
    }, 'SOS alert sent'));
});

// what emergencies did i send before
export const getEmergencyHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const emergencies = await Emergency.find({ user: req.user?._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, emergencies, 'Emergency history retrieved'));
});

// get the emergency contact list
export const getEmergencyContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const config = await SystemConfig.getConfig();
    return res.status(200).json(new ApiResponse(200, config.emergencyContacts, 'Emergency contacts retrieved'));
});

// see active sos alerts (warden)
export const getActiveAlerts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const alerts = await Emergency.find({ status: 'active' })
        .populate('user', 'name rollNo room hostel phone')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, alerts, 'Active alerts retrieved'));
});

// warden says I got it
export const acknowledgeAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
    const alert = await Emergency.findByIdAndUpdate(
        req.params.id,
        {
            status: 'acknowledged',
            acknowledgedBy: req.user?._id,
            acknowledgedAt: new Date(),
        },
        { new: true }
    );

    if (!alert) {
        throw new ApiError(404, 'Alert not found');
    }

    return res.status(200).json(new ApiResponse(200, alert, 'Alert acknowledged'));
});

// warden marks it as solved
export const resolveAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
    const alert = await Emergency.findByIdAndUpdate(
        req.params.id,
        { status: 'resolved' },
        { new: true }
    );

    if (!alert) {
        throw new ApiError(404, 'Alert not found');
    }

    return res.status(200).json(new ApiResponse(200, alert, 'Alert resolved'));
});
