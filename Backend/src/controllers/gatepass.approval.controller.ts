// src/controllers/gatepass.approval.controller.ts
// Warden pass approvals, rejections, pending queue, and history handlers

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import GatePass from '../models/GatePass';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { createNotification } from '../services/notification.service';

// get passes waiting for warden approval - GET /api/gatepass/pending
export const getPendingPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    // wardens only see stuff waiting for THEM (PENDING_WARDEN)
    const passes = await GatePass.find({ status: 'PENDING_WARDEN' })
        .populate('user', 'name rollNo room hostel phone')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, passes, 'Pending passes retrieved'));
});

// get every single pass ever (for warden history) - GET /api/gatepass/all
export const getAllPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [passes, total] = await Promise.all([
        GatePass.find()
            .populate('user', 'name rollNo room hostel phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        GatePass.countDocuments(),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination }, 'All passes retrieved'));
});

// approve a pass (warden action) - PUT /api/gatepass/:id/approve
export const approveGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status !== 'PENDING_WARDEN' && req.user?.role !== 'admin') {
        throw new ApiError(400, 'Gate pass is not pending warden approval');
    }

    pass.status = 'APPROVED';
    pass.qrValue = `GP-${uuidv4().slice(0, 8).toUpperCase()}`;
    pass.approvedBy = req.user?._id;
    await pass.save();

    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: 'Gate Pass Approved',
        message: 'Your gate pass has been approved. Show the QR code at the gate.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass approved'));
});

// reject a pass (warden action) - PUT /api/gatepass/:id/reject
export const rejectGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);

    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status !== 'PENDING_WARDEN' && req.user?.role !== 'admin') {
        throw new ApiError(400, 'Gate pass is not pending warden approval');
    }

    pass.status = 'REJECTED';
    await pass.save();

    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: 'Gate Pass Rejected',
        message: 'Your gate pass request has been rejected.',
        link: '/gate-pass',
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass rejected'));
});
