// src/controllers/foodrating.controller.ts
// Food Rating controller with production-grade patterns

import { Response } from 'express';
import FoodRating from '../models/FoodRating';
import MessMenu from '../models/MessMenu';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

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

    // Time-based validation: Check if rating is allowed for this meal
    const menuData = await MessMenu.findOne();
    const mealTiming = menuData?.timings?.[mealType as 'Breakfast' | 'Lunch' | 'Dinner'];

    if (!mealTiming) {
        throw new ApiError(400, 'Meal timing not found. Please contact admin.');
    }

    // Parse meal start time (e.g., "07:30")
    const [startHour, startMinute] = mealTiming.start.split(':').map(Number);

    // Create Date objects for comparison in IST timezone
    // Meal timings are in IST, so we must convert server time to IST
    const getISTTime = () => {
        const now = new Date();
        // Convert to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes
        return new Date(now.getTime() + (istOffset - now.getTimezoneOffset() * 60 * 1000));
    };
    const now = getISTTime();
    const todayMealStart = new Date();
    todayMealStart.setHours(startHour, startMinute, 0, 0);

    // Calculate 12-hour window end (from meal start time)
    const ratingWindowEnd = new Date(todayMealStart);
    ratingWindowEnd.setHours(ratingWindowEnd.getHours() + 12);

    // Format time for error messages
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Validate rating window
    if (now < todayMealStart) {
        throw new ApiError(400, `Rating not available yet. ${mealType} starts at ${mealTiming.start}`);
    }

    if (now > ratingWindowEnd) {
        throw new ApiError(400, `Rating window closed. You can rate ${mealType} within 12 hours of ${mealTiming.start} (until ${formatTime(ratingWindowEnd)})`);
    }

    // Use IST time for date as well
    const today = getISTTime();
    today.setHours(0, 0, 0, 0);

    // Update or create rating for today
    const foodRating = await FoodRating.findOneAndUpdate(
        { user: req.user?._id, mealType, date: today },
        { rating, comment, date: today },
        { new: true, upsert: true }
    );

    return res.status(200).json(new ApiResponse(200, foodRating, 'Rating submitted'));
});

// @desc    Get average ratings
// @route   GET /api/food-rating/average
export const getAverageRatings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dateParam = req.query.date as string | undefined;
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    queryDate.setHours(0, 0, 0, 0);

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
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const ratings = await FoodRating.find({ user: req.user?._id, date: queryDate });

    const result: Record<string, any> = {};
    ratings.forEach((r) => {
        result[r.mealType] = { rating: r.rating, comment: r.comment };
    });

    return res.status(200).json(new ApiResponse(200, result, 'User ratings retrieved'));
});
