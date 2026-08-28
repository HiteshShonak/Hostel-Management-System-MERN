// src/controllers/gatepass.guard.controller.ts
// Guard scanner validation, entry/exit timestamp recording handlers

import { Response } from 'express';
import GatePass from '../models/GatePass';
import GatePassLog from '../models/GatePassLog';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createNotification } from '../services/notification.service';

// check if qr code is valid (guard action) - POST /api/gatepass/validate
export const validateGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { qrValue } = req.body;
    if (!qrValue) {
        throw new ApiError(400, 'QR value is required');
    }

    const pass = await GatePass.findOne({ qrValue, status: 'APPROVED' })
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        return res.status(200).json(new ApiResponse(200, { valid: false, error: 'Invalid or expired pass' }, 'Validation failed'));
    }

    const now = new Date();

    // Check if pass is expired (toDate already passed)
    if (now > new Date(pass.toDate)) {
        const isStudentOutside = pass.exitTime && !pass.entryTime;
        return res.status(200).json(new ApiResponse(200, {
            valid: false,
            error: isStudentOutside ? 'Pass expired - Student is still outside!' : 'Pass has expired',
            status: 'EXPIRED',
            isExpired: true,
            isStudentOutside: isStudentOutside,
            pass: pass,
        }, 'Pass expired'));
    }

    // check if pass hasn't started yet
    if (now < new Date(pass.fromDate)) {
        return res.status(200).json(new ApiResponse(200, {
            valid: false,
            error: 'Pass not valid yet - starts on ' + new Date(pass.fromDate).toLocaleDateString(),
            status: 'NOT_STARTED',
            pass: pass,
        }, 'Pass not started'));
    }

    pass.validatedBy = req.user?._id;
    pass.validatedAt = now;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, { valid: true, pass }, 'Gate pass validated'));
});

// mark student leaving the campus - PUT /api/gatepass/:id/exit
export const markExit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id)
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }
    if (pass.status !== 'APPROVED') {
        throw new ApiError(400, 'Gate pass is not approved');
    }

    const now = new Date();
    if (now > new Date(pass.toDate)) {
        throw new ApiError(400, 'Gate pass has expired');
    }
    if (pass.exitTime && !pass.entryTime) {
        throw new ApiError(400, 'Student already exited and has not returned yet');
    }

    pass.exitTime = now;
    pass.exitMarkedBy = req.user?._id;
    pass.entryTime = undefined;
    pass.entryMarkedBy = undefined;
    await pass.save();

    await GatePassLog.create({
        gatePass: pass._id,
        user: pass.user._id || pass.user,
        action: 'EXIT',
        timestamp: now,
        markedBy: req.user?._id,
    });

    createNotification({
        userId: pass.user._id || pass.user,
        type: 'gatepass',
        title: '🚶 Exit Recorded',
        message: 'Your exit has been recorded. Have a safe trip!',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Student exit marked successfully'));
});

// mark student entering the campus - PUT /api/gatepass/:id/entry
export const markEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id)
        .populate('user', 'name rollNo room hostel phone');

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }
    if (!pass.exitTime) {
        throw new ApiError(400, 'Student has not exited yet');
    }
    if (pass.entryTime) {
        throw new ApiError(400, 'Student already inside. Need to exit first.');
    }

    const now = new Date();
    const toDate = new Date(pass.toDate);
    const isLate = now > toDate;
    let lateNote = '';

    if (isLate) {
        const lateByMs = now.getTime() - toDate.getTime();
        const lateByMinutes = Math.floor(lateByMs / (1000 * 60));
        const hours = Math.floor(lateByMinutes / 60);
        const minutes = lateByMinutes % 60;
        lateNote = hours > 0 ? `Student returned ${hours}h ${minutes}m late` : `Student returned ${minutes}m late`;
    }

    pass.entryTime = now;
    pass.entryMarkedBy = req.user?._id;
    await pass.save();

    await GatePassLog.create({
        gatePass: pass._id,
        user: pass.user._id || pass.user,
        action: 'ENTRY',
        timestamp: now,
        markedBy: req.user?._id,
        isLate: isLate,
        note: isLate ? lateNote : undefined,
    });

    createNotification({
        userId: pass.user._id || pass.user,
        type: 'gatepass',
        title: isLate ? '⏰ Late Return Recorded' : '🏠 Welcome Back!',
        message: isLate ? `${lateNote}. Entry has been recorded.` : 'Your return has been recorded.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    const response = {
        ...pass.toObject(),
        isLate: isLate,
        lateNote: isLate ? lateNote : undefined,
    };

    return res.status(200).json(new ApiResponse(200, response, isLate ? 'Late entry marked successfully' : 'Student entry marked successfully'));
});
