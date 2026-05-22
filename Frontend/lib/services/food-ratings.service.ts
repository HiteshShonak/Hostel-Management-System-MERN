// lib/services/food-ratings.service.ts — Food rating service
import api from '../api';
import { FoodRating, FoodRatingRequest, FoodRatingAverage } from '../types';

export const foodRatingService = {
    rate: async (data: FoodRatingRequest): Promise<FoodRating> => {
        const response = await api.post<FoodRating>('/food-rating', data);
        return response.data;
    },

    getAverage: async (date?: string): Promise<FoodRatingAverage> => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get<FoodRatingAverage>(`/food-rating/average${params}`);
        return response.data;
    },

    getMyRatings: async (date?: string): Promise<Record<string, { rating: number; comment?: string }>> => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get(`/food-rating/my-ratings${params}`);
        return response.data;
    },
};
