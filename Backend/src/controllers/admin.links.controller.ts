// src/controllers/admin.links.controller.ts
// Parent-Student relationship linking, unlinking, and query handlers

import { Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// Link parent account to student account
export const linkParentToStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { parentId, studentId, relationship } = req.body;

    // Validate parent exists and has parent role
    const parent = await User.findById(parentId);
    if (!parent) {
        throw new ApiError(404, 'Parent user not found');
    }
    if (parent.role !== 'parent') {
        throw new ApiError(400, 'User is not registered as a parent');
    }

    // Validate student exists and is a student
    const student = await User.findById(studentId);
    if (!student) {
        throw new ApiError(404, 'Student user not found');
    }
    if (student.role !== 'student') {
        throw new ApiError(400, 'User is not a student');
    }

    // Check if link already exists
    const existingLink = await ParentStudent.findOne({ parent: parentId, student: studentId });
    if (existingLink) {
        throw new ApiError(409, 'This parent-student relationship already exists');
    }

    // Create the link
    const link = await ParentStudent.create({
        parent: parentId,
        student: studentId,
        relationship,
        linkedBy: req.user?._id,
        status: 'active',
    });

    // Populate for response
    const populatedLink = await ParentStudent.findById(link._id)
        .populate('parent', 'name email phone')
        .populate('student', 'name email rollNo room hostel')
        .populate('linkedBy', 'name');

    return res.status(201).json(new ApiResponse(201, populatedLink, 'Parent-student link created successfully'));
});

// Unlink parent and student relationship
export const unlinkParentFromStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const link = await ParentStudent.findById(req.params.id);

    if (!link) {
        throw new ApiError(404, 'Parent-student link not found');
    }

    // Soft delete by setting status to inactive
    link.status = 'inactive';
    await link.save();

    return res.status(200).json(new ApiResponse(200, null, 'Parent-student link removed successfully'));
});

// Retrieve all active parent-student links with pagination
export const getAllParentLinks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [links, total] = await Promise.all([
        ParentStudent.find({ status: 'active' })
            .populate('parent', 'name email phone')
            .populate('student', 'name rollNo room hostel email')
            .populate('linkedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ParentStudent.countDocuments({ status: 'active' }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { links, pagination }, 'Parent-student links retrieved'));
});

// Retrieve parent-student relationships for a specific user ID
export const getUserRelations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    // Get user to determine role
    const user = await User.findById(userId).select('name email role rollNo');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Use aggregation to get relations efficiently
    const relations = await ParentStudent.aggregate([
        {
            $match: {
                $or: [
                    { parent: new Types.ObjectId(userId as string) },
                    { student: new Types.ObjectId(userId as string) }
                ],
                status: 'active'
            }
        },
        // Lookup parent details
        {
            $lookup: {
                from: 'users',
                localField: 'parent',
                foreignField: '_id',
                as: 'parentInfo'
            }
        },
        // Lookup student details
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'studentInfo'
            }
        },
        { $unwind: '$parentInfo' },
        { $unwind: '$studentInfo' },
        {
            $project: {
                _id: 1,
                relationship: 1,
                status: 1,
                createdAt: 1,
                parent: {
                    _id: '$parentInfo._id',
                    name: '$parentInfo.name',
                    email: '$parentInfo.email',
                    phone: '$parentInfo.phone'
                },
                student: {
                    _id: '$studentInfo._id',
                    name: '$studentInfo.name',
                    email: '$studentInfo.email',
                    rollNo: '$studentInfo.rollNo',
                    room: '$studentInfo.room',
                    hostel: '$studentInfo.hostel',
                    year: '$studentInfo.year'
                }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, { user, relations }, 'User relations retrieved'));
});
