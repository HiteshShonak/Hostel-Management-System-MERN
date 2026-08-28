// src/controllers/parent.children.controller.ts
// Parent controller: viewing linked students and paginated child gate pass history

import { Response } from 'express';
import { Types } from 'mongoose';
import ParentStudent from '../models/ParentStudent';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// Retrieve all students linked to the authenticated parent - GET /api/parent/children
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

// Retrieve all gate passes for linked students with pagination - GET /api/parent/passes
export const getAllChildrenPasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parentId = req.user?._id;
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { studentId } = req.query;

    const matchCondition: any = { parent: new Types.ObjectId(parentId), status: 'active' };
    if (studentId) {
        matchCondition.student = new Types.ObjectId(studentId as string);
    }

    const countPipeline = [
        { $match: matchCondition },
        { $lookup: { from: 'gatepasses', localField: 'student', foreignField: 'user', as: 'passes' } },
        { $unwind: '$passes' },
        { $count: 'total' }
    ];
    const countResult = await ParentStudent.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

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
