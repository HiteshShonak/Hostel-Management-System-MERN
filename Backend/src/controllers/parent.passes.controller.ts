// src/controllers/parent.passes.controller.ts
// Parent controller: review pending gate passes, approvals, and rejections

import { Response } from 'express';
import { Types } from 'mongoose';
import ParentStudent from '../models/ParentStudent';
import GatePass from '../models/GatePass';
import User from '../models/User';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createNotification } from '../services/notification.service';

// Retrieve gate passes awaiting parent approval - GET /api/parent/pending-passes
export const getPendingPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;

    const pendingPasses = await ParentStudent.aggregate([
        // Match current parent's active links
        { $match: { parent: new Types.ObjectId(parentId), status: 'active' } },
        // Lookup gate passes for each linked student
        {
            $lookup: {
                from: 'gatepasses',
                localField: 'student',
                foreignField: 'user',
                as: 'passes'
            }
        },
        { $unwind: '$passes' },
        // Filter only pending parent approval
        { $match: { 'passes.status': 'PENDING_PARENT' } },
        // Lookup student info
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'studentInfo'
            }
        },
        { $unwind: '$studentInfo' },
        {
            $project: {
                _id: '$passes._id',
                reason: '$passes.reason',
                fromDate: '$passes.fromDate',
                toDate: '$passes.toDate',
                status: '$passes.status',
                createdAt: '$passes.createdAt',
                relationship: 1,
                student: {
                    _id: '$studentInfo._id',
                    name: '$studentInfo.name',
                    rollNo: '$studentInfo.rollNo',
                    room: '$studentInfo.room',
                    hostel: '$studentInfo.hostel',
                    phone: '$studentInfo.phone'
                }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, pendingPasses, 'Pending passes retrieved'));
});

// Approve a student's gate pass (advances status to PENDING_WARDEN) - PUT /api/parent/passes/:id/approve
export const approvePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const passId = req.params.id;

    const pass = await GatePass.findById(passId).populate('user', 'name');
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    // Verify parent is linked to this student
    const link = await ParentStudent.findOne({
        parent: parentId,
        student: pass.user._id,
        status: 'active'
    });

    if (!link) {
        throw new ApiError(403, 'You are not authorized to approve this gate pass');
    }

    if (pass.status !== 'PENDING_PARENT') {
        throw new ApiError(400, `Pass is already ${pass.status.toLowerCase()}`);
    }

    pass.status = 'PENDING_WARDEN';
    pass.parentApprovedBy = parentId;
    pass.parentApprovedAt = new Date();
    await pass.save();

    // Notify student
    createNotification({
        userId: pass.user._id,
        type: 'gatepass',
        title: 'Parent Approved Gate Pass',
        message: 'Your parent has approved your gate pass. Now waiting for warden approval.',
        relatedId: pass._id,
    });

    // Notify wardens about new pending pass
    const wardens = await User.find({ role: 'warden' }).select('_id');
    for (const warden of wardens) {
        createNotification({
            userId: warden._id,
            type: 'gatepass',
            title: 'New Gate Pass Pending',
            message: `Gate pass from ${(pass.user as any).name} is waiting for approval.`,
            relatedId: pass._id,
        });
    }

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass approved by parent'));
});

// Reject a student's gate pass with an optional reason - PUT /api/parent/passes/:id/reject
export const rejectPass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const passId = req.params.id;
    const { reason } = req.body;

    const pass = await GatePass.findById(passId);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    const link = await ParentStudent.findOne({
        parent: parentId,
        student: pass.user,
        status: 'active'
    });

    if (!link) {
        throw new ApiError(403, 'You are not authorized to reject this gate pass');
    }

    if (pass.status !== 'PENDING_PARENT') {
        throw new ApiError(400, `Pass is already ${pass.status.toLowerCase()}`);
    }

    pass.status = 'REJECTED';
    pass.parentRejectionReason = reason || 'Rejected by parent';
    await pass.save();

    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: 'Gate Pass Rejected',
        message: `Your parent has rejected your gate pass. Reason: ${reason || 'No reason provided'}`,
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass rejected'));
});
