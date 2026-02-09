// src/controllers/foodrating.controller.ts
// Food Rating controller with production-grade patterns

import { Response } from 'express';
import FoodRating from '../models/FoodRating';
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

    const today = new Date();
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
