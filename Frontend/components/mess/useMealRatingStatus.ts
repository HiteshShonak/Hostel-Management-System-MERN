import { useMemo } from 'react';
import type { MealType, DayType, MessTimings } from '@/lib/types';
import { nowIST } from '@/lib/utils/date';
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
            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            }
            return `${minutes}m`;
        };

        const formatISTTime = (date: Date): string => {
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, '0');
            return `${displayHours}:${displayMinutes} ${ampm}`;
        };

        if (!timings || !timings[selectedMeal]) {
            return {
                canRate: false,
                message: 'Timing not available',
                isDifferentDay,
                isBeforeMeal,
                currentDayName,
                timing,
                mealStart,
                ratingWindowEnd,
                mealNotStarted,
                formatTimeRemaining,
                formatISTTime,
            };
        }

        if (isDifferentDay) {
            const currentDayIndex = DAYS.indexOf(currentDayName);
            const checkDayIndex = DAYS.indexOf(selectedDay);
            const isYesterday = checkDayIndex === (currentDayIndex - 1 + 7) % 7;

            if (!isYesterday) {
                return {
                    canRate: false,
                    message: checkDayIndex < currentDayIndex ? 'Past meals cannot be rated' : 'Future meals cannot be rated',
                    isDifferentDay,
                    isBeforeMeal,
                    currentDayName,
                    timing,
                    mealStart,
                    ratingWindowEnd,
                    mealNotStarted,
                    formatTimeRemaining,
                    formatISTTime,
                };
            }

            if (currentISTTime > ratingWindowEnd) {
                return {
                    canRate: false,
                    message: `Rating period ended. Switch to ${currentDayName} to rate today's ${selectedMeal.toLowerCase()}`,
                    isDifferentDay,
                    isBeforeMeal,
                    currentDayName,
                    timing,
                    mealStart,
                    ratingWindowEnd,
                    mealNotStarted,
                    formatTimeRemaining,
                    formatISTTime,
                };
            }

            return {
                canRate: true,
                message: '',
                isDifferentDay,
                isBeforeMeal,
                currentDayName,
                timing,
                mealStart,
                ratingWindowEnd,
                mealNotStarted,
                formatTimeRemaining,
                formatISTTime,
            };
        }

        if (currentISTTime < mealStart) {
            return {
                canRate: false,
                message: `Available from ${timing?.start || ''}`,
                isDifferentDay,
                isBeforeMeal,
                currentDayName,
                timing,
                mealStart,
                ratingWindowEnd,
                mealNotStarted,
                formatTimeRemaining,
                formatISTTime,
            };
        }

        if (currentISTTime > ratingWindowEnd) {
            return {
                canRate: false,
                message: `Rating period for ${selectedMeal.toLowerCase()} has ended`,
                isDifferentDay,
                isBeforeMeal,
                currentDayName,
                timing,
                mealStart,
                ratingWindowEnd,
                mealNotStarted,
                formatTimeRemaining,
                formatISTTime,
            };
        }

        return {
            canRate: true,
            message: '',
            isDifferentDay,
            isBeforeMeal,
            currentDayName,
            timing,
            mealStart,
            ratingWindowEnd,
            mealNotStarted,
            formatTimeRemaining,
            formatISTTime,
        };
    }, [selectedMeal, selectedDay, timings]);
}
