// lib/hooks/useFoodRatings.ts — Food rating hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodRatingService } from '../services';
import { FoodRatingRequest } from '../types';

export const useFoodRatingAverage = (date?: string) => {
    return useQuery({
        queryKey: ['food-rating', 'average', date],
        queryFn: () => foodRatingService.getAverage(date),
    });
};

export const useMyFoodRatings = (date?: string) => {
    return useQuery({
        queryKey: ['food-rating', 'my', date],
        queryFn: () => foodRatingService.getMyRatings(date),
    });
};

export const useRateMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FoodRatingRequest) => foodRatingService.rate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['food-rating'] });
        },
    });
};
