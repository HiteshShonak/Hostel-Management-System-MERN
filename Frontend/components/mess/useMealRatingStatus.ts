import { useMemo } from 'react';
import type { MealType, DayType, MessTimings } from '@/lib/types';
import { nowIST, formatTime } from '@/lib/utils';
import { DAYS } from './DayTabBar';

export interface RatingStatusResult {
    canRate: boolean;
    message: string;
    isDifferentDay: boolean;
    isBeforeMeal: boolean;
    currentDayName: DayType;
    timing?: { start: string; end: string };
    mealStart: Date;
    ratingWindowEnd: Date;
    mealNotStarted: boolean;
    formatTimeRemaining: (targetDate: Date) => string;
    formatISTTime: (date: Date) => string;
}

export function useMealRatingStatus(
    selectedMeal: MealType,
    selectedDay: DayType,
    timings?: MessTimings
): RatingStatusResult {
    return useMemo(() => {
        const currentISTTime = nowIST();
        const currentDayName = currentISTTime.toLocaleDateString('en-IN', { weekday: 'long' }) as DayType;
        const timing = timings?.[selectedMeal];
        const [startHour, startMinute] = timing?.start.split(':').map(Number) || [0, 0];

        const isDifferentDay = selectedDay !== currentDayName;

        let mealStart: Date;
        if (isDifferentDay) {
            mealStart = new Date(currentISTTime);
            mealStart.setUTCDate(mealStart.getUTCDate() - 1);
            mealStart.setUTCHours(startHour, startMinute, 0, 0);
        } else {
            mealStart = new Date(currentISTTime);
            mealStart.setUTCHours(startHour, startMinute, 0, 0);
        }

        const ratingWindowEnd = new Date(mealStart.getTime() + 12 * 60 * 60 * 1000);
        const mealNotStarted = currentISTTime < mealStart;
        const isBeforeMeal = mealNotStarted && !isDifferentDay;

        const formatTimeRemaining = (targetDate: Date) => {
            const diff = targetDate.getTime() - currentISTTime.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        };

        const formatISTTime = (date: Date): string => formatTime(date);

        const buildResult = (canRate: boolean, message: string): RatingStatusResult => ({
            canRate,
            message,
            isDifferentDay,
            isBeforeMeal,
            currentDayName,
            timing,
            mealStart,
            ratingWindowEnd,
            mealNotStarted,
            formatTimeRemaining,
            formatISTTime,
        });

        if (!timings || !timings[selectedMeal]) {
            return buildResult(false, 'Timing not available');
        }

        if (isDifferentDay) {
            const currentDayIndex = DAYS.indexOf(currentDayName);
            const checkDayIndex = DAYS.indexOf(selectedDay);
            const isYesterday = checkDayIndex === (currentDayIndex - 1 + 7) % 7;

            if (!isYesterday) {
                const msg = checkDayIndex < currentDayIndex ? 'Past meals cannot be rated' : 'Future meals cannot be rated';
                return buildResult(false, msg);
            }

            if (currentISTTime > ratingWindowEnd) {
                return buildResult(
                    false,
                    `Rating period ended. Switch to ${currentDayName} to rate today's ${selectedMeal.toLowerCase()}`
                );
            }

            return buildResult(true, '');
        }

        if (currentISTTime < mealStart) {
            return buildResult(false, `Available from ${timing?.start || ''}`);
        }

        if (currentISTTime > ratingWindowEnd) {
            return buildResult(false, `Rating period for ${selectedMeal.toLowerCase()} has ended`);
        }

        return buildResult(true, '');
    }, [selectedMeal, selectedDay, timings]);
}
