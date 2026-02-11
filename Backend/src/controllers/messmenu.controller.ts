// src/controllers/messmenu.controller.ts
// Mess menu controller for daily meal schedules

import { Response } from 'express';
import MessMenu from '../models/MessMenu';
import Notice from '../models/Notice';
import { AuthRequest, DayType, MealType } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import cache, { CACHE_KEYS, CACHE_TTL } from '../utils/cache';

// @desc    Get full weekly menu with timings
// @route   GET /api/messmenu
export const getMessMenu = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Try cache first (menu rarely changes)
    const cached = await cache.get(CACHE_KEYS.MESS_MENU);
    if (cached) {
        return res.status(200).json(new ApiResponse(200, cached, 'Menu retrieved (cached)'));
    }

    const menus = await MessMenu.find();

    // Convert to object keyed by day, including timings
    const menuByDay: Record<string, any> = {};
    let timings: any = null;

    menus.forEach((menu) => {
        menuByDay[menu.day] = menu.meals;
        // Use timings from first menu (should be same for all)
        if (!timings && menu.timings) {
            timings = menu.timings;
        }
    });

    const data = { menu: menuByDay, timings };

    // Cache for 24 hours (mess menu rarely changes)
    await cache.set(CACHE_KEYS.MESS_MENU, data, CACHE_TTL.MESS_MENU);

    return res.status(200).json(new ApiResponse(200, data, 'Menu retrieved'));
});

// @desc    Update menu for a specific day (Mess Staff)
// @route   PUT /api/messmenu/:day
export const updateDayMenu = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { day } = req.params;
    const { meals } = req.body;

    const validDays: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (!validDays.includes(day as DayType)) {
        throw new ApiError(400, 'Invalid day');
    }

    if (!meals) {
        throw new ApiError(400, 'Meals data is required');
    }

    const menu = await MessMenu.findOneAndUpdate(
        { day },
        { meals, updatedBy: req.user?._id, updatedAt: new Date() },
        { new: true, upsert: true }
    );

    // Invalidate menu cache
    await cache.delete(CACHE_KEYS.MESS_MENU);

    return res.status(200).json(new ApiResponse(200, menu, 'Menu updated successfully'));
});

// @desc    Update meal timings (Mess Staff) - creates urgent notice on change
// @route   PUT /api/messmenu/timings
export const updateTimings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { timings } = req.body;

    if (!timings) {
        throw new ApiError(400, 'Timings data is required');
    }

    // Validate timings structure
    const validMeals: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];
    for (const meal of validMeals) {
        if (!timings[meal] || !timings[meal].start || !timings[meal].end) {
            throw new ApiError(400, `Invalid timings for ${meal}`);
        }
    }

    // Get old timings for comparison
    const existingMenu = await MessMenu.findOne();
    const oldTimings = existingMenu?.timings;

    // Check if timings actually changed
    let timingsChanged = false;
    if (oldTimings) {
        for (const meal of validMeals) {
            if (
                oldTimings[meal].start !== timings[meal].start ||
                oldTimings[meal].end !== timings[meal].end
            ) {
                timingsChanged = true;
                break;
            }
        }
    } else {
        timingsChanged = true;
    }

    // Update all days with new timings
    await MessMenu.updateMany(
        {},
        { timings, updatedBy: req.user?._id, updatedAt: new Date() }
    );

    // If timings changed, create urgent notice
    if (timingsChanged) {
        await Notice.create({
            title: '🕐 Mess Timings Updated',
            description: `New meal timings:\n• Breakfast: ${timings.Breakfast.start} - ${timings.Breakfast.end}\n• Lunch: ${timings.Lunch.start} - ${timings.Lunch.end}\n• Dinner: ${timings.Dinner.start} - ${timings.Dinner.end}`,
            urgent: true,
            createdBy: req.user?._id,
            source: 'mess_staff',
        });
    }

    return res.status(200).json(new ApiResponse(200, { timings }, 'Timings updated successfully'));
});

