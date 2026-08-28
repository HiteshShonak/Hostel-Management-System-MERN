// src/controllers/admin.oversight.controller.ts
// Gate pass, notice, and complaint oversight handlers for Admin

import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import GatePass from '../models/GatePass';
import Notice from '../models/Notice';
import Complaint from '../models/Complaint';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Retrieve all gate passes with status, student, and date filtering
export const getAllGatePasses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { status, studentId, fromDate, toDate } = req.query;

    // Dynamic filter
    const filter: any = {};
    if (status) filter.status = status;
    if (studentId) filter.user = studentId;
    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
        if (toDate) filter.createdAt.$lte = new Date(toDate as string);
    }

    const [passes, total] = await Promise.all([
        GatePass.find(filter)
            .populate('user', 'name rollNo room hostel email phone')
            .populate('approvedBy', 'name')
            .populate('parentApprovedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        GatePass.countDocuments(filter),
    ]);

    // Stats
    const stats = await GatePass.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { passes, pagination, stats }, 'All gate passes retrieved'));
});

// Cancel / reject any gate pass (admin override)
export const adminCancelGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    // Admin can force reject any pass
    pass.status = 'REJECTED';
    pass.rejectionReason = `Cancelled by admin: ${req.user?.name}`;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass cancelled by admin'));
});

// Force approve a gate pass with QR code generation (admin override)
export const adminForceApproveGatePass = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pass = await GatePass.findById(req.params.id);
    if (!pass) {
        throw new ApiError(404, 'Gate pass not found');
    }

    if (pass.status === 'APPROVED') {
        throw new ApiError(400, 'Gate pass is already approved');
    }

    // Force approve with QR code
    pass.status = 'APPROVED';
    pass.qrValue = uuidv4();
    pass.approvedBy = req.user?._id;
    await pass.save();

    return res.status(200).json(new ApiResponse(200, pass, 'Gate pass force-approved by admin'));
});

// Retrieve all notices with pagination and filtering
export const getAllNotices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { source, urgent, search } = req.query;

    const filter: any = {};
    if (source) filter.source = source;
    if (urgent === 'true') filter.urgent = true;
    if (search) {
        const escaped = escapeRegex(search as string);
        filter.$or = [
            { title: { $regex: escaped, $options: 'i' } },
            { description: { $regex: escaped, $options: 'i' } },
        ];
    }

    const [notices, total] = await Promise.all([
        Notice.find(filter)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notice.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { notices, pagination }, 'All notices retrieved'));
});

// Delete a notice by ID (admin only)
export const adminDeleteNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        throw new ApiError(404, 'Notice not found');
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, null, 'Notice deleted by admin'));
});

// Retrieve all complaints with pagination and status/category filters
export const getAllComplaints = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { status, category } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [complaints, total] = await Promise.all([
        Complaint.find(filter)
            .populate('user', 'name rollNo room hostel')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Complaint.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { complaints, pagination }, 'All complaints retrieved'));
});
