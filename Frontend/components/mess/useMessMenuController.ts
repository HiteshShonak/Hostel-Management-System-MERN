import { useState } from 'react';
import { Alert } from 'react-native';
import {
    useMessMenu,
    useUpdateMessMenu,
    useUpdateTimings,
    useFoodRatingAverage,
    useMyFoodRatings,
    useRateMeal,
} from '@/lib/hooks';
import type { MealType, DayType, MessTimings } from '@/lib/types';
import { nowIST, getCurrentISTHour, formatDateYMD } from '@/lib/utils/date';
import { DAYS } from './DayTabBar';

export function useMessMenuController() {
    const today = nowIST().toLocaleDateString('en-IN', { weekday: 'long' }) as DayType;

    const getInitialMeal = (): MealType => {
        const hour = getCurrentISTHour();
        if (hour < 10) return 'Breakfast';
        if (hour < 15) return 'Lunch';
        return 'Dinner';
    };

    const [selectedDay, setSelectedDay] = useState<DayType>(DAYS.includes(today) ? today : 'Monday');
    const [selectedMeal, setSelectedMeal] = useState<MealType>(getInitialMeal());
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItems, setEditItems] = useState('');
    const [ratingMeal, setRatingMeal] = useState<MealType | null>(null);
    const [showTimingModal, setShowTimingModal] = useState(false);
    const [editTimings, setEditTimings] = useState<MessTimings>({
        Breakfast: { start: '07:30', end: '09:30' },
        Lunch: { start: '12:00', end: '14:00' },
        Dinner: { start: '19:00', end: '21:00' },
    });

    const getDateForDay = (day: DayType): string => {
        const dayIndex = DAYS.indexOf(day);
        const now = nowIST();
        const currentDayIndex = (now.getUTCDay() + 6) % 7;
        const diff = dayIndex - currentDayIndex;
        const targetDate = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
        return formatDateYMD(targetDate);
    };

    const selectedDate = getDateForDay(selectedDay);

    const { data: menuData, isLoading, error } = useMessMenu();
    const { data: averageRatings } = useFoodRatingAverage(selectedDate);
    const { data: myRatings } = useMyFoodRatings(selectedDate);
    const updateMenuMutation = useUpdateMessMenu();
    const updateTimingsMutation = useUpdateTimings();
    const rateMealMutation = useRateMeal();

    const menu = menuData?.menu;
    const timings = menuData?.timings;

    const currentMeals = menu?.[selectedDay]?.[selectedMeal] || [];
    const currentTiming = timings?.[selectedMeal];
    const currentRating = averageRatings?.[selectedMeal];
    const myCurrentRating = myRatings?.[selectedMeal];

    const handleEditMenu = () => {
        setEditItems(currentMeals.join('\n'));
        setShowEditModal(true);
    };

    const handleSaveMenu = () => {
        const items = editItems.split('\n').filter((item) => item.trim());
        const meals = { ...menu?.[selectedDay], [selectedMeal]: items };
        updateMenuMutation.mutate(
            { day: selectedDay, data: { meals: meals as any } },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    Alert.alert('Success', 'Menu updated successfully');
                },
                onError: () => Alert.alert('Error', 'Failed to update menu'),
            }
        );
    };

    const handleOpenTimingEditor = () => {
        setEditTimings({
            Breakfast: { start: '07:30', end: '09:30' },
            Lunch: { start: '12:00', end: '14:00' },
            Dinner: { start: '19:00', end: '21:00' },
            ...(timings || {}),
        });
        setShowTimingModal(true);
    };

    const handleSaveTimings = () => {
        updateTimingsMutation.mutate(editTimings, {
            onSuccess: () => {
                setShowTimingModal(false);
                Alert.alert('Success', 'Timings updated! An urgent notice has been created.');
            },
            onError: () => Alert.alert('Error', 'Failed to update timings'),
        });
    };

    const handleRate = (rating: number) => {
        if (!ratingMeal) return;
        rateMealMutation.mutate(
            { mealType: ratingMeal, rating },
            {
                onSuccess: () => {
                    setRatingMeal(null);
                    Alert.alert('Thanks!', 'Your rating has been submitted');
                },
                onError: (err: any) => {
                    setRatingMeal(null);
                    const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit rating';
                    Alert.alert('Error', errorMessage);
                },
            }
        );
    };

    const handleTimingChange = (meal: MealType, field: 'start' | 'end', time: string) => {
        setEditTimings((prev) => {
            const currentSlot = prev[meal] || { start: '07:00', end: '09:00' };
            return {
                ...prev,
                [meal]: {
                    ...currentSlot,
                    [field]: time,
                },
            };
        });
    };

    return {
        today,
        selectedDay,
        setSelectedDay,
        selectedMeal,
        setSelectedMeal,
        showEditModal,
        setShowEditModal,
        editItems,
        setEditItems,
        ratingMeal,
        setRatingMeal,
        showTimingModal,
        setShowTimingModal,
        editTimings,
        isLoading,
        error,
        menu,
        timings,
        currentMeals,
        currentTiming,
        currentRating,
        myCurrentRating,
        updateMenuMutation,
        updateTimingsMutation,
        handleEditMenu,
        handleSaveMenu,
        handleOpenTimingEditor,
        handleSaveTimings,
        handleRate,
        handleTimingChange,
    };
}
