// src/controllers/auth.controller.ts
// handles login, signup, and password stuff

import { Request, Response } from 'express';
import User from '../models/User';
import ParentStudent from '../models/ParentStudent';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateToken } from '../services/jwt.service';
import { logger } from '../utils/logger';

// register a new user
// POST /api/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, rollNo, room, hostel, phone, role, parentEmail } = req.body;

    logger.debug('Register request', { name, email, rollNo, role, hasParentEmail: !!parentEmail });

    // check if everything is there
    if (!name || !email || !password || !rollNo || !room || !hostel || !phone) {
        throw new ApiError(400, 'Please provide all required fields');
    }

    // check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (existingUser) {
        throw new ApiError(409, 'User with this email or roll number already exists');
    }

    // validate role (mostly for parents)
    const validRoles = ['student', 'warden', 'mess_staff', 'guard', 'admin', 'parent'];
    const userRole = validRoles.includes(role) ? role : 'student';

    logger.debug('Creating user', { role: userRole });

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        rollNo,
        room,
        hostel,
        phone,
        role: userRole,
        parentEmail: parentEmail || undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff`,
    });

    logger.info('User created', { userId: user._id, role: userRole });

    // auto-linking logic (bidirectional)
    let linkedData = null;

    try {
        // case 1: student signing up - link to parent
        if (parentEmail && userRole === 'student') {
            logger.debug('Checking for parent', { parentEmail });
            const parentUser = await User.findOne({ email: parentEmail, role: 'parent' });
            if (parentUser) {
                logger.info('Parent found, creating link', { parentId: parentUser._id });
                await ParentStudent.create({
                    parent: parentUser._id,
                    student: user._id,
                    relationship: 'Guardian',
                    linkedBy: user._id,
                    status: 'active',
                });
                linkedData = { parent: { name: parentUser.name, email: parentUser.email } };
            } else {
                logger.debug('Parent not found, skipping link');
            }
        }

        // case 2: parent signing up - link to waiting students
        if (userRole === 'parent') {
            logger.debug('Checking for students waiting for parent', { parentEmail: email });
            const students = await User.find({ parentEmail: email, role: 'student' }).exec();
            if (students && Array.isArray(students) && students.length > 0) {
                logger.info('Students found, creating links', { count: students.length });
                const links = students.map(student => ({
                    parent: user._id,
                    student: student._id,
                    relationship: 'Guardian',
                    linkedBy: student._id,
                    status: 'active',
                }));
                await ParentStudent.insertMany(links);
                linkedData = { studentsCount: students.length };
            } else {
                logger.debug('No students waiting for parent');
            }
        }
    } catch (linkError) {
        // Log but don't fail registration if linking fails
        logger.error('Auto-linking failed', { error: linkError instanceof Error ? linkError.message : String(linkError) });
    }

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        room: user.room,
        hostel: user.hostel,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        linkedData, // Include linking info if available
        token: generateToken(user._id.toString()),
    };

    let message = 'User registered successfully';
    if (linkedData) {
        if ('parent' in linkedData) {
            message += `. Linked to parent: ${linkedData.parent.name}`;
        } else if ('studentsCount' in linkedData) {
            message += `. Linked to ${linkedData.studentsCount} existing student(s)`;
        }
    }

    logger.info('Registration complete', { userId: user._id, email: user.email });
    return res.status(201).json(new ApiResponse(201, userData, message));
});

// login user
// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    }

    // find user and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        room: user.room,
        hostel: user.hostel,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id.toString()),
    };

    return res.status(200).json(new ApiResponse(200, userData, 'Login successful'));
});

// get current user profile
// GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(new ApiResponse(200, user, 'User profile retrieved'));
});

// update profile details
// PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, phone, room } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { name, phone, room },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

// change password
// PUT /api/auth/password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Please provide current password and new password');
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, 'New password must be at least 6 characters');
    }

    // get user with password to verify
    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // verify old password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect');
    }

    // update to new password (hashed automatically)
    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

// update push token for notifications
// PUT /api/auth/push-token
export const updatePushToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { pushToken } = req.body;

    if (!pushToken) {
        throw new ApiError(400, 'Push token is required');
    }

    // check expo token format
    if (!pushToken.startsWith('ExponentPushToken[')) {
        throw new ApiError(400, 'Invalid push token format');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            pushToken,
            pushTokenUpdatedAt: new Date()
        },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    logger.info('Push token updated', { userId: user._id });
    return res.status(200).json(new ApiResponse(200, { pushToken: user.pushToken }, 'Push token updated successfully'));
});

