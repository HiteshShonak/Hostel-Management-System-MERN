// Parent controller for viewing linked students and managing gate pass approvals

import { Response } from 'express';
import { Types } from 'mongoose';
import ParentStudent from '../models/ParentStudent';
import GatePass from '../models/GatePass';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { getISTDate } from '../utils/timezone';
import { createNotification } from '../services/notification.service';

// Retrieve all students linked to the authenticated parent
export const getChildren = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;

    const children = await ParentStudent.aggregate([
        { $match: { parent: new Types.ObjectId(parentId), status: 'active' } },
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
                _id: '$studentInfo._id',
                name: '$studentInfo.name',
                email: '$studentInfo.email',
                rollNo: '$studentInfo.rollNo',
                room: '$studentInfo.room',
                hostel: '$studentInfo.hostel',
                phone: '$studentInfo.phone',
                year: '$studentInfo.year',
                relationship: 1,
                linkedAt: '$createdAt'
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, children, 'Children retrieved successfully'));
});

// Retrieve gate passes awaiting parent approval
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

        // Flatten passes array
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

        // Project final shape
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

// Retrieve all gate passes for linked students with pagination
export const getAllChildrenPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { studentId } = req.query;

    // Build match condition
    const matchCondition: any = { parent: new Types.ObjectId(parentId), status: 'active' };
    if (studentId) {
        matchCondition.student = new Types.ObjectId(studentId as string);
    }

    // Get total count first
    const countPipeline = [
        { $match: matchCondition },
        { $lookup: { from: 'gatepasses', localField: 'student', foreignField: 'user', as: 'passes' } },
        { $unwind: '$passes' },
        { $count: 'total' }
    ];
    const countResult = await ParentStudent.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Get passes with pagination
    const passes = await ParentStudent.aggregate([
        { $match: matchCondition },
        {
            $lookup: {
                from: 'gatepasses',
                localField: 'student',
                foreignField: 'user',
                as: 'passes'
            }
        },
        { $unwind: '$passes' },
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
                qrValue: '$passes.qrValue',
                parentApprovedAt: '$passes.parentApprovedAt',
                createdAt: '$passes.createdAt',
                relationship: 1,
                student: {
                    _id: '$studentInfo._id',
                    name: '$studentInfo.name',
                    rollNo: '$studentInfo.rollNo',
                    room: '$studentInfo.room',
                    hostel: '$studentInfo.hostel'
                }
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination }, 'Gate passes retrieved'));
});

// Approve a student's gate pass (advances status to PENDING_WARDEN)
export const approvePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const passId = req.params.id;

    // Find the pass
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

    // Check pass is in correct status
    if (pass.status !== 'PENDING_PARENT') {
        throw new ApiError(400, `Pass is already ${pass.status.toLowerCase()}`);
    }

    // Approve
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
    const wardens = await (await import('../models/User')).default.find({ role: 'warden' }).select('_id');
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

// Reject a student's gate pass with an optional reason
export const rejectPass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const passId = req.params.id;
    const { reason } = req.body;

    // Find the pass
    const pass = await GatePass.findById(passId);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    // Verify parent is linked to this student
    const link = await ParentStudent.findOne({
        parent: parentId,
        student: pass.user,
        status: 'active'
    });

    if (!link) {
        throw new ApiError(403, 'You are not authorized to reject this gate pass');
    }

    // Check pass is in correct status
    if (pass.status !== 'PENDING_PARENT') {
        throw new ApiError(400, `Pass is already ${pass.status.toLowerCase()}`);
    }

    // Reject
    pass.status = 'REJECTED';
    pass.parentRejectionReason = reason || 'Rejected by parent';
    await pass.save();

    // Notify student
    createNotification({
        userId: pass.user,
        type: 'gatepass',
        title: 'Gate Pass Rejected',
        message: `Your parent has rejected your gate pass. Reason: ${reason || 'No reason provided'}`,
        relatedId: pass._id,
    });

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass rejected'));
});

