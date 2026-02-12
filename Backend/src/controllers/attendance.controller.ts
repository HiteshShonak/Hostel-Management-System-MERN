// Attendance controller with geofenced location validation

import { Response } from 'express';
import Attendance from '../models/Attendance';
import SystemConfig from '../models/SystemConfig';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination';
import { isInsideGeofence, isValidCoordinates } from '../utils/geometry';
import { getISTTime, getISTDate } from '../utils/timezone';

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

    const config = await SystemConfig.getConfig();

    // Validate location
    if (latitude === undefined || longitude === undefined) {
        throw new ApiError(400, 'Location access is required to mark attendance. Please enable GPS.');
    }

    if (!isValidCoordinates(latitude, longitude)) {
        throw new ApiError(400, 'Invalid GPS coordinates provided.');
    }

    // Check if within geofence
    const { isInside, distance } = isInsideGeofence(
        latitude,
        longitude,
        config.hostelCoords.latitude,
        config.hostelCoords.longitude,
        config.geofenceRadiusMeters
    );

    if (!isInside) {
        throw new ApiError(
            403,
            `You are ${distance}m away from the hostel. Please come within ${config.geofenceRadiusMeters}m of the hostel to mark attendance.`
        );
    }

    // Check time window if enabled
    if (config.attendanceWindow.enabled) {
        const istTime = getISTTime();
        const hour = istTime.getUTCHours();
        const minutes = istTime.getUTCMinutes();

        const gracePeriod = config.appConfig.attendanceGracePeriod || 0;
        const totalMinutes = hour * 60 + minutes;
        const windowStart = config.attendanceWindow.startHour * 60;
        const windowEnd = config.attendanceWindow.endHour * 60 + gracePeriod;

        if (totalMinutes < windowStart || totalMinutes >= windowEnd) {
            const startTime = config.attendanceWindow.startHour > 12
                ? `${config.attendanceWindow.startHour - 12} PM`
                : `${config.attendanceWindow.startHour} AM`;
            const endTime = config.attendanceWindow.endHour > 12
                ? `${config.attendanceWindow.endHour - 12} PM`
                : `${config.attendanceWindow.endHour} AM`;

            throw new ApiError(
                400,
                `Attendance can only be marked between ${startTime} and ${endTime} (IST).`
            );
        }
    }

    // Create attendance record
    const today = getISTDate();

    try {
        const attendance = await Attendance.create({
            user: req.user?._id,
            date: today,
            markedAt: new Date(), // Store as UTC, frontend converts to IST
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
    // Use IST for today's date
    const today = getISTDate();

    const attendance = await Attendance.findOne({ user: req.user?._id, date: today });

    // Get dynamic config for geofence info
    const config = await SystemConfig.getConfig();

    // Also return geofence info for frontend (dynamic from config)
    return res.status(200).json(new ApiResponse(200, {
        marked: !!attendance,
        attendance,
        geofence: {
            hostelName: config.hostelCoords.name,
            radiusMeters: config.geofenceRadiusMeters,
            attendanceWindow: config.attendanceWindow.enabled
                ? { start: config.attendanceWindow.startHour, end: config.attendanceWindow.endHour }
                : null,
        },
    }, 'Today attendance status'));
});

// @desc    Get attendance stats for current month
// @route   GET /api/attendance/stats
export const getAttendanceStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const now = getISTTime();
    const firstDay = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);
    const totalDays = now.getUTCDate();

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
        month: now.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    }, 'Attendance stats retrieved'));
});
