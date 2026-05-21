// lib/types/food-ratings.ts — Food rating types
import { MealType } from './mess';

export interface FoodRating {
    _id: string;
    mealType: MealType;
    rating: number;
    comment?: string;
    date: string;
}

export interface FoodRatingRequest {
    mealType: MealType;
    rating: number;
    comment?: string;
}

export interface FoodRatingAverage {
    [mealType: string]: {
        average: number;
        count: number;
    };
}
