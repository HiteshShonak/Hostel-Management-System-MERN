// src/controllers/helper.controller.ts
// Helper role: registration operator with elevated identity management powers

import { Response } from 'express';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { logger } from '../utils/logger';

// Register a new user on behalf of another person - POST /api/helper/register
export const helperRegisterUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, email, password, rollNo, room, hostel, phone, role, year, parentEmail } = req.body;

    logger.info('Helper registering new user', { helperEmail: req.user?.email, targetRole: role, targetEmail: email });

    // Check for duplicate email or rollNo
    const existing = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (existing) {
        throw new ApiError(409, 'A user with this email or ID already exists');
    }

    // Create the new user
    const user = await User.create({
        name,
        email,
        password,
        rollNo,
        room,
        hostel,
        phone,
        role,
        ...(role === 'student' && year !== undefined ? { year } : {}),
        parentEmail: parentEmail || undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff`,
    });

    // Auto-link parent if applicable
    let linkedData = null;
    try {
        if (parentEmail && role === 'student') {
            const parentUser = await User.findOne({ email: parentEmail, role: 'parent' });
            if (parentUser) {
                await ParentStudent.create({
                    parent: parentUser._id,
                    student: user._id,
                    relationship: 'Guardian',
                    linkedBy: req.user!._id,
                    status: 'active',
                });
                linkedData = { parent: { name: parentUser.name, email: parentUser.email } };
            }
        }

        if (role === 'parent') {
            const students = await User.find({ parentEmail: email, role: 'student' });
            if (students.length > 0) {
                const links = students.map(s => ({
                    parent: user._id,
                    student: s._id,
                    relationship: 'Guardian',
                    linkedBy: req.user!._id,
                    status: 'active',
                }));
                await ParentStudent.insertMany(links);
                linkedData = { studentsCount: students.length };
            }
        }
    } catch (linkError) {
        logger.warn('Auto-linking skipped during helper register', { error: String(linkError) });
    }

    logger.info('Helper successfully created user', { userId: user._id, role });

    return res.status(201).json(new ApiResponse(201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        room: user.room,
        hostel: user.hostel,
        phone: user.phone,
        role: user.role,
        year: user.year,
        avatar: user.avatar,
        createdAt: user.createdAt,
        linkedData,
        registeredBy: { _id: req.user!._id, name: req.user!.name, email: req.user!.email },
    }, `${role} account created successfully by helper`));
});

// Force-reset any user's password without needing their current password - PUT /api/helper/users/:id/reset-password
export const helperResetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(id).select('+password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Prevent changing another helper's/admin's password (security guard)
    if ((user.role === 'admin' || user.role === 'helper') && req.user?.role !== 'admin') {
        throw new ApiError(403, 'Helpers cannot reset passwords for admin or other helper accounts');
    }

    logger.info('Helper force-resetting password', { helperEmail: req.user?.email, targetUserId: id, targetRole: user.role });

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, 'Password reset successfully'));
});

// Search / list users for the helper to find who to manage - GET /api/helper/users
export const helperSearchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, role } = req.query;
    const { page, limit, skip } = getPaginationParams(req, 20);

    const filter: any = {};
    if (role) filter.role = role;
    if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [{ name: regex }, { email: regex }, { rollNo: regex }];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('name email rollNo room hostel phone role year avatar createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(filter),
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    return res.status(200).json(new ApiResponse(200, { users, pagination }, 'Users retrieved'));
});

// Get a single user by ID - GET /api/helper/users/:id
export const helperGetUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id).select('name email rollNo room hostel phone role year avatar createdAt').lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(new ApiResponse(200, user, 'User retrieved'));
});
