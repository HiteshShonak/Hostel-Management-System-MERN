// Attendance controller with geofenced location validation

import { Response } from 'express';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { isInsideGeofence, isValidCoordinates } from '../utils/geometry';
import { HOSTEL_COORDS, GEOFENCE_RADIUS_METERS, ATTENDANCE_WINDOW } from '../constants';

// @desc    Get user's attendance history with pagination
// @route   GET /api/attendance?page=1&limit=20
export const getAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req, 20);

    const [attendance, total] = await Promise.all([
        Attendance.find({ user: req.user?._id })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        Attendance.countDocuments({ user: req.user?._id }),
    ]);

    const pagination = getPaginationMeta(total, page, limit);

    return res.status(200).json(new ApiResponse(200, { attendance, pagination }, 'Attendance retrieved'));
});

// @desc    Mark attendance for today with geofence validation
// @route   POST /api/attendance/mark
export const markAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { latitude, longitude } = req.body;

    // 1. Validate location input
    if (latitude === undefined || longitude === undefined) {
        throw new ApiError(400, 'Location access is required to mark attendance. Please enable GPS.');
    }

    if (!isValidCoordinates(latitude, longitude)) {
        throw new ApiError(400, 'Invalid GPS coordinates provided.');
    }

    // 2. Check geofence
    const { isInside, distance } = isInsideGeofence(
        latitude,
        longitude,
        HOSTEL_COORDS.latitude,
        HOSTEL_COORDS.longitude,
        GEOFENCE_RADIUS_METERS
    );

    if (!isInside) {
        throw new ApiError(
            403,
            `You are ${distance}m away from the hostel. Please come within ${GEOFENCE_RADIUS_METERS}m of the hostel to mark attendance.`
        );
    }

    // 3. Check time window (optional, can be disabled in constants)
    if (ATTENDANCE_WINDOW.enabled) {
        const now = new Date();
        const hour = now.getHours();

        if (hour < ATTENDANCE_WINDOW.startHour || hour >= ATTENDANCE_WINDOW.endHour) {
            const startTime = ATTENDANCE_WINDOW.startHour > 12
                ? `${ATTENDANCE_WINDOW.startHour - 12} PM`
                : `${ATTENDANCE_WINDOW.startHour} AM`;
            const endTime = ATTENDANCE_WINDOW.endHour > 12
                ? `${ATTENDANCE_WINDOW.endHour - 12} PM`
                : `${ATTENDANCE_WINDOW.endHour} AM`;

            throw new ApiError(
                400,
                `Attendance can only be marked between ${startTime} and ${endTime}.`
            );
        }
    }

    // 4. Create attendance record (unique index will prevent duplicates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const attendance = await Attendance.create({
            user: req.user?._id,
            date: today,
            markedAt: new Date(),
            location: {
                latitude,
                longitude,
                distanceFromHostel: distance,
            },
        });

        return res.status(201).json(
            new ApiResponse(201, attendance, `Attendance marked successfully! You were ${distance}m from the hostel.`)
        );
    } catch (error: any) {
        // Handle duplicate key error (11000) from unique index
        if (error.code === 11000) {
            throw new ApiError(409, 'Attendance already marked for today.');
        }
        throw error;
    }
});

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
export const getTodayAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ user: req.user?._id, date: today });

    // Also return geofence info for frontend
    return res.status(200).json(new ApiResponse(200, {
        marked: !!attendance,
        attendance,
        geofence: {
            hostelName: HOSTEL_COORDS.name,
            radiusMeters: GEOFENCE_RADIUS_METERS,
            attendanceWindow: ATTENDANCE_WINDOW.enabled
                ? { start: ATTENDANCE_WINDOW.startHour, end: ATTENDANCE_WINDOW.endHour }
                : null,
        },
    }, 'Today attendance status'));
});

// @desc    Get attendance stats for current month
// @route   GET /api/attendance/stats
export const getAttendanceStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // Use current day of month as total (not full month)
    const totalDays = now.getDate();

    const attendance = await Attendance.countDocuments({
        user: req.user?._id,
        date: { $gte: firstDay, $lte: now },
    });

    const percentage = totalDays > 0 ? Math.round((attendance / totalDays) * 100) : 0;

    return res.status(200).json(new ApiResponse(200, {
        present: attendance,
        absent: totalDays - attendance,
        total: totalDays,
        percentage,
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    }, 'Attendance stats retrieved'));
});
