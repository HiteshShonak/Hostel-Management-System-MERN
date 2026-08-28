// src/controllers/admin.system.controller.ts
// System statistics and configuration settings handlers for Admin

import { Response } from 'express';
import User from '../models/User';
import GatePass from '../models/GatePass';
import Notice from '../models/Notice';
import Complaint from '../models/Complaint';
import SystemConfig from '../models/SystemConfig';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

// Retrieve system-wide statistics for the admin dashboard
export const getSystemStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
        totalUsers,
        totalStudents,
        totalWardens,
        totalParents,
        totalAdmins,
        totalGuards,
        totalMessStaff,
        totalHelpers,
        totalPasses,
        approvedPasses,
        pendingPasses,
        rejectedPasses,
        totalNotices,
        pendingComplaints,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'warden' }),
        User.countDocuments({ role: 'parent' }),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'guard' }),
        User.countDocuments({ role: 'mess_staff' }),
        User.countDocuments({ role: 'helper' }),
        GatePass.countDocuments(),
        GatePass.countDocuments({ status: 'APPROVED' }),
        GatePass.countDocuments({ status: { $in: ['PENDING_PARENT', 'PENDING_WARDEN'] } }),
        GatePass.countDocuments({ status: 'REJECTED' }),
        Notice.countDocuments(),
        Complaint.countDocuments({ status: 'Pending' }),
    ]);

    return res.status(200).json(new ApiResponse(200, {
        users: {
            total: totalUsers,
            students: totalStudents,
            byRole: {
                student: totalStudents,
                warden: totalWardens,
                parent: totalParents,
                admin: totalAdmins,
                guard: totalGuards,
                mess_staff: totalMessStaff,
                helper: totalHelpers,
            },
        },
        gatePasses: {
            total: totalPasses,
            approved: approvedPasses,
            pending: pendingPasses,
            rejected: rejectedPasses,
        },
        notices: totalNotices,
        pendingComplaints: pendingComplaints,
    }, 'System statistics retrieved'));
});

// Retrieve singleton system configuration
export const getSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    return res.status(200).json(new ApiResponse(200, config, 'System configuration retrieved'));
});

// Update system configuration settings
export const updateSystemConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { appConfig, emergencyContacts } = req.body;

    // Get or create config
    let config = await SystemConfig.findById('system-config');
    if (!config) {
        config = await SystemConfig.create({ _id: 'system-config' });
    }

    // Track what changed for logging
    const changes: string[] = [];

    if (appConfig) {
        if (appConfig.maxGatePassDays !== undefined && appConfig.maxGatePassDays !== config.appConfig.maxGatePassDays) {
            changes.push(`appConfig.maxGatePassDays: ${config.appConfig.maxGatePassDays} → ${appConfig.maxGatePassDays}`);
            config.appConfig.maxGatePassDays = appConfig.maxGatePassDays;
        }
        if (appConfig.maxPendingPasses !== undefined && appConfig.maxPendingPasses !== config.appConfig.maxPendingPasses) {
            changes.push(`appConfig.maxPendingPasses: ${config.appConfig.maxPendingPasses} → ${appConfig.maxPendingPasses}`);
            config.appConfig.maxPendingPasses = appConfig.maxPendingPasses;
        }
    }

    if (emergencyContacts) {
        // Replace entire array if provided
        config.emergencyContacts = emergencyContacts;
        changes.push(`emergencyContacts: Updated with ${emergencyContacts.length} contact(s)`);
    }

    config.updatedAt = new Date();
    config.updatedBy = req.user?._id;

    await config.save();

    // Log the changes
    if (changes.length > 0) {
        logger.info(`🔧 System config updated by ${req.user?.name || 'Unknown'} (${req.user?.role})`, {
            userId: req.user?._id?.toString(),
            changes,
        });
    } else {
        logger.info(`🔧 System config save (no changes detected) by ${req.user?.name || 'Unknown'}`);
    }

    return res.status(200).json(new ApiResponse(200, config, 'System configuration updated'));
});
