import React from 'react';
import type { MealType, DayType, MessTimings } from '@/lib/types';
import { useMealRatingStatus } from './useMealRatingStatus';
import { RatingBlockedCard } from './RatingBlockedCard';
import { RatingAvailableBanner } from './RatingAvailableBanner';

interface MealRatingBannerProps {
    selectedMeal: MealType;
    selectedDay: DayType;
    timings?: MessTimings;
    myCurrentRating?: { rating: number };
    onOpenRateModal: () => void;
}

export function MealRatingBanner({
    selectedMeal,
    selectedDay,
    timings,
    myCurrentRating,
    onOpenRateModal,
}: MealRatingBannerProps) {
    const status = useMealRatingStatus(selectedMeal, selectedDay, timings);

    if (!status.canRate) {
        return <RatingBlockedCard status={status} selectedMeal={selectedMeal} />;
    }

    return (
        <RatingAvailableBanner
            status={status}
            myCurrentRating={myCurrentRating}
            onOpenRateModal={onOpenRateModal}
        />
    );
}
