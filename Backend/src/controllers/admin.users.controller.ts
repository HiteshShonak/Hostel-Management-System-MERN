// src/controllers/admin.users.controller.ts
// User management handlers for Admin: listing, search, role update, and account deletion

import { Response } from 'express';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import GatePass from '../models/GatePass';
import GatePassLog from '../models/GatePassLog';
import Complaint from '../models/Complaint';
import Notification from '../models/Notification';
import Emergency from '../models/Emergency';
import FoodRating from '../models/FoodRating';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// List all users with optional role and search filters
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);
    const { role, search } = req.query;

    // Build filter
    const filter: any = {};
    if (role) {
        filter.role = role;
    }
    if (search) {
        const escaped = escapeRegex(search as string);
        filter.$or = [
            { name: { $regex: escaped, $options: 'i' } },
            { email: { $regex: escaped, $options: 'i' } },
            { rollNo: { $regex: escaped, $options: 'i' } },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('name email rollNo room hostel phone role year createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { users, pagination }, 'Users retrieved'));
});

// Update a user's role
export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { role } = req.body;
    const validRoles = ['student', 'admin', 'warden', 'mess_staff', 'guard', 'parent', 'helper'];

    if (!validRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role specified');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, 'User role updated successfully'));
});

// Permanently delete a user account and clean up related records
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user?._id?.toString()) {
        throw new ApiError(400, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    // Clean up all related records across collections
    const userId = req.params.id;
    await Promise.all([
        ParentStudent.deleteMany({ $or: [{ parent: userId }, { student: userId }] }),
        GatePass.deleteMany({ user: userId }),
        GatePassLog.deleteMany({ user: userId }),
        Complaint.deleteMany({ user: userId }),
        Notification.deleteMany({ user: userId }),
        Emergency.deleteMany({ user: userId }),
        FoodRating.deleteMany({ user: userId }),
    ]);

    return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});
