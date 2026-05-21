// lib/types/mess.ts — Mess menu types
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MealTiming {
    start: string;
    end: string;
}

export interface MessTimings {
    Breakfast: MealTiming;
    Lunch: MealTiming;
    Dinner: MealTiming;
}

export interface MessMenu {
    [day: string]: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
    };
}

export interface MessMenuResponse {
    menu: MessMenu;
    timings: MessTimings;
}

export interface MessMenuUpdate {
    meals: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
    };
}
