// src/controllers/complaint.controller.ts
// handles student complaints about maintenance and stuff

import { Response } from 'express';
import Complaint from '../models/Complaint';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// get my complaints
// GET /api/complaints
export const getComplaints = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 10);

    const [complaints, total] = await Promise.all([
        Complaint.find({ user: req.user?._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Complaint.countDocuments({ user: req.user?._id }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { complaints, pagination }, 'Complaints retrieved'));
});

// file a new complaint
// POST /api/complaints
export const createComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category, title, description } = req.body;

    if (!category || !title || !description) {
        throw new ApiError(400, 'Category, title, and description are required');
    }

    const complaint = await Complaint.create({
        user: req.user?._id,
        category,
        title,
        description,
    });

    return res.status(201).json(new ApiResponse(201, complaint, 'Complaint submitted successfully'));
});

// get all complaints (for warden)
// GET /api/complaints/all
export const getAllComplaints = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [complaints, total] = await Promise.all([
        Complaint.find()
            .populate('user', 'name rollNo room hostel')
            .sort({ status: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Complaint.countDocuments(),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { complaints, pagination }, 'All complaints retrieved'));
});

// mark complaint as resolved
// PUT /api/complaints/:id/resolve
export const resolveComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status: 'Resolved', resolvedAt: new Date() },
        { new: true }
    );

    if (!complaint) {
        throw new ApiError(404, 'Complaint not found');
    }

    // let the student know it's fixed
    const { createNotification } = await import('../services/notification.service');
    createNotification({
        userId: complaint.user,
        type: 'complaint',
        title: '✅ Complaint Resolved',
        message: `Your complaint "${complaint.title}" has been resolved.`,
        link: '/complaints',
        relatedId: complaint._id,
    });

    return res.status(200).json(new ApiResponse(200, complaint, 'Complaint resolved'));
});

// update status manually
// PUT /api/complaints/:id/status
export const updateComplaintStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    // validate status against allowed values
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updateData: any = { status };

    if (status === 'Resolved') {
        updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!complaint) {
        throw new ApiError(404, 'Complaint not found');
    }

    return res.status(200).json(new ApiResponse(200, complaint, 'Complaint status updated'));
});
