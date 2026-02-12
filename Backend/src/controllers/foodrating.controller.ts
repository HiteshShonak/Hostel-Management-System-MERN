// src/controllers/foodrating.controller.ts
// Food rating controller for mess meal feedback

import { Response } from 'express';
import FoodRating from '../models/FoodRating';
import MessMenu from '../models/MessMenu';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { getISTDate, toISTDate, getISTTime } from '../utils/timezone';

// @desc    Rate a meal
// @route   POST /api/food-rating
export const rateMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { mealType, rating, comment } = req.body;

    if (!mealType || !rating) {
        throw new ApiError(400, 'Meal type and rating are required');
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, 'Rating must be between 1 and 5');
    }

    // Validate mealType
    const validMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    if (!validMealTypes.includes(mealType)) {
        throw new ApiError(400, 'Invalid meal type');
    }

    // Get meal timing from database
    const menuData = await MessMenu.findOne();
    const mealTiming = menuData?.timings?.[mealType as 'Breakfast' | 'Lunch' | 'Dinner'];

    if (!mealTiming) {
        throw new ApiError(400, 'Meal timing not found. Please contact admin.');
    }

    const [startHour, startMinute] = mealTiming.start.split(':').map(Number);
    const now = getISTTime();

    const todayMealStart = new Date(now);
    todayMealStart.setUTCHours(startHour, startMinute, 0, 0);

    const yesterdayMealStart = new Date(todayMealStart);
    yesterdayMealStart.setUTCDate(yesterdayMealStart.getUTCDate() - 1);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        });
    };

    let targetMealStart: Date;
    let validationDay: Date;

    if (now < todayMealStart) {
        // Before today's meal - check if rating yesterday's meal
        const yesterdayWindowEnd = new Date(yesterdayMealStart);
        yesterdayWindowEnd.setUTCHours(yesterdayWindowEnd.getUTCHours() + 12);

        if (now >= yesterdayMealStart && now <= yesterdayWindowEnd) {
            targetMealStart = yesterdayMealStart;
            validationDay = getISTDate();
            validationDay.setUTCDate(validationDay.getUTCDate() - 1);
        } else {
            throw new ApiError(400, `Rating not available yet. ${mealType} starts at ${mealTiming.start}`);
        }
    } else {
        // After today's meal - check if within 12h window
        const todayWindowEnd = new Date(todayMealStart);
        todayWindowEnd.setUTCHours(todayWindowEnd.getUTCHours() + 12);

        if (now > todayWindowEnd) {
            throw new ApiError(400, `Rating window closed. You can rate ${mealType} within 12 hours of ${mealTiming.start} (until ${formatTime(todayWindowEnd)})`);
        }

        targetMealStart = todayMealStart;
        validationDay = getISTDate();
    }

    const foodRating = await FoodRating.findOneAndUpdate(
        { user: req.user?._id, mealType, date: validationDay },
        { rating, comment, date: validationDay },
        { new: true, upsert: true }
    );

    return res.status(200).json(new ApiResponse(200, foodRating, 'Rating submitted'));
});

// @desc    Get average ratings
// @route   GET /api/food-rating/average
export const getAverageRatings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dateParam = req.query.date as string | undefined;
    const queryDate = dateParam ? toISTDate(new Date(dateParam)) : getISTDate();

    const aggregation = await FoodRating.aggregate([
        { $match: { date: queryDate } },
        {
            $group: {
                _id: '$mealType',
                average: { $avg: '$rating' },
                count: { $sum: 1 },
            },
        },
    ]);

    const result: Record<string, { average: number; count: number }> = {};
    aggregation.forEach((item) => {
        result[item._id] = { average: Math.round(item.average * 10) / 10, count: item.count };
    });

    return res.status(200).json(new ApiResponse(200, result, 'Average ratings retrieved'));
});

// @desc    Get user's ratings for a specific date (defaults to today)
// @route   GET /api/food-rating/my-ratings?date=YYYY-MM-DD
export const getMyRatings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dateParam = req.query.date as string | undefined;
    const queryDate = dateParam ? toISTDate(new Date(dateParam)) : getISTDate();

    const ratings = await FoodRating.find({ user: req.user?._id, date: queryDate });

    const result: Record<string, any> = {};
    ratings.forEach((r) => {
        result[r.mealType] = { rating: r.rating, comment: r.comment };
    });

    return res.status(200).json(new ApiResponse(200, result, 'User ratings retrieved'));
});
