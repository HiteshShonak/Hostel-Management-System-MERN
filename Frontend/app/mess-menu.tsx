import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Modal, TextInput, Alert, RefreshControl, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useMessMenu, useUpdateMessMenu, useUpdateTimings, useFoodRatingAverage, useMyFoodRatings, useRateMeal, useRefreshDashboard } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { TimeScrollPicker } from '@/components/TimeScrollPicker';
import type { MealType, DayType, MessTimings } from '@/lib/types';
import { nowIST, getCurrentISTHour, formatHour, formatDateYMD } from '@/lib/utils/date';

const DAYS: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS: { type: MealType; icon: string; color: string }[] = [
    { type: 'Breakfast', icon: 'cafe', color: '#f59e0b' },
    { type: 'Lunch', icon: 'sunny', color: '#f97316' },
    { type: 'Dinner', icon: 'moon', color: '#6366f1' },
];

export default function MessMenuPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const isMessStaff = user?.role === 'mess_staff' || user?.role === 'admin';
    const isWarden = user?.role === 'warden' || user?.role === 'admin';
    const { refreshing, onRefresh } = useRefreshDashboard();

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

    // Calculate the actual date for the selected day in the current week
    const getDateForDay = (day: DayType): string => {
        const dayIndex = DAYS.indexOf(day);
        const now = nowIST();
        const currentDayIndex = (now.getUTCDay() + 6) % 7; // Mon=0, Sun=6
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

    // Timing editor state
    const [showTimingModal, setShowTimingModal] = useState(false);
    const [editTimings, setEditTimings] = useState<MessTimings>({
        Breakfast: { start: '07:30', end: '09:30' },
        Lunch: { start: '12:00', end: '14:00' },
        Dinner: { start: '19:00', end: '21:00' },
    });

    // Extract menu and timings from new API response
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
        const items = editItems.split('\n').filter(item => item.trim());
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
        if (timings) {
            setEditTimings(timings);
        }
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
                onError: (error: any) => {
                    setRatingMeal(null);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit rating';
                    Alert.alert('Error', errorMessage);
                },
            }
        );
    };


    const formatISTTime = (date: Date): string => {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    const isRatingAvailable = (mealType: MealType, dayToCheck: DayType): { canRate: boolean; message: string } => {
        const currentISTTime = nowIST();
        const currentDayName = currentISTTime.toLocaleDateString('en-IN', { weekday: 'long' }) as DayType;

        if (!timings || !timings[mealType]) {
            return { canRate: false, message: 'Timing not available' };
        }

        const timing = timings[mealType];
        const [startHour, startMinute] = timing.start.split(':').map(Number);

        // Check if this is a different day
        if (dayToCheck !== currentDayName) {
            const currentDayIndex = DAYS.indexOf(currentDayName);
            const checkDayIndex = DAYS.indexOf(dayToCheck);

            // Allow yesterday only (for overnight windows like dinner)
            const isYesterday = checkDayIndex === (currentDayIndex - 1 + 7) % 7;

            if (!isYesterday) {
                return {
                    canRate: false,
                    message: checkDayIndex < currentDayIndex ? 'Past meals cannot be rated' : 'Future meals cannot be rated'
                };
            }

            // For yesterday, check if within 12h window
            const yesterdayMealStart = new Date(currentISTTime);
            yesterdayMealStart.setUTCDate(yesterdayMealStart.getUTCDate() - 1);
            yesterdayMealStart.setUTCHours(startHour, startMinute, 0, 0);
            const yesterdayWindowEnd = new Date(yesterdayMealStart.getTime() + 12 * 60 * 60 * 1000);

            if (currentISTTime > yesterdayWindowEnd) {
                return {
                    canRate: false,
                    message: `Rating period ended. Switch to ${currentDayName} to rate today's ${mealType.toLowerCase()}`
                };
            }

            return { canRate: true, message: '' };
        }

        // Today's meal - normal flow
        const now = currentISTTime;
        const todayMealStart = new Date(now);
        todayMealStart.setUTCHours(startHour, startMinute, 0, 0);

        const ratingWindowEnd = new Date(todayMealStart.getTime() + 12 * 60 * 60 * 1000);

        if (now < todayMealStart) {
            return {
                canRate: false,
                message: `Available from ${timing.start}`
            };
        }

        if (now > ratingWindowEnd) {
            return {
                canRate: false,
                message: `Rating period for ${mealType.toLowerCase()} has ended`
            };
        }

        return { canRate: true, message: '' };
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Mess Menu" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading menu...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    if (error || !menu) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Mess Menu" />
                <View style={styles.error}>
                    <Ionicons name="restaurant-outline" size={64} color={colors.textTertiary} />
                    <Text style={[styles.errorTitle, { color: colors.text }]}>Menu Not Available</Text>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Check back later for today's menu</Text>
                </View>
                <BottomNav />
            </View>
        );
    }



    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Mess Menu" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Mess Staff: Edit Button */}
                    {isMessStaff && (
                        <Pressable style={[styles.editBtn, { backgroundColor: colors.success }]} onPress={handleEditMenu}>
                            <Ionicons name="create" size={20} color="white" />
                            <Text style={styles.editBtnText}>Edit Menu</Text>
                        </Pressable>
                    )}

                    {/* Day Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.daySelector}>
                            {DAYS.map((day) => (
                                <Pressable
                                    key={day}
                                    onPress={() => setSelectedDay(day)}
                                    style={[styles.dayBtn, { backgroundColor: colors.backgroundSecondary }, selectedDay === day && { backgroundColor: colors.primary }]}
                                >
                                    <Text style={[styles.dayText, { color: colors.textSecondary }, selectedDay === day && styles.dayTextActive]}>
                                        {day.slice(0, 3)}
                                    </Text>
                                    {day === today && <View style={[styles.todayDot, { backgroundColor: colors.success }]} />}
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Meal Tabs */}
                    <View style={[styles.mealTabs, { backgroundColor: colors.backgroundSecondary }]}>
                        {MEALS.map(({ type, icon, color }) => (
                            <Pressable
                                key={type}
                                onPress={() => setSelectedMeal(type)}
                                style={[styles.mealTab, selectedMeal === type && [styles.mealTabActive, { backgroundColor: colors.card }]]}
                            >
                                <Ionicons name={icon as any} size={16} color={color} />
                                <Text style={[styles.mealText, { color: colors.textSecondary }, selectedMeal === type && { fontWeight: '500', color: colors.text }]}>
                                    {type}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Meal Timing Display */}
                    {currentTiming && (
                        <View style={[styles.timingBar, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
                            <Ionicons name="time-outline" size={16} color="#6366f1" />
                            <Text style={styles.timingText}>
                                {currentTiming.start} - {currentTiming.end}
                            </Text>
                            {isMessStaff && (
                                <Pressable style={[styles.editTimingBtn, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]} onPress={handleOpenTimingEditor}>
                                    <Ionicons name="create-outline" size={16} color="#6366f1" />
                                    <Text style={styles.editTimingText}>Edit Timings</Text>
                                </Pressable>
                            )}
                        </View>
                    )}

                    {/* Average Rating */}
                    {currentRating && (
                        <View style={[styles.avgRating, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                            <View style={styles.avgStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name={star <= Math.round(currentRating.average) ? 'star' : 'star-outline'}
                                        size={20}
                                        color="#f59e0b"
                                    />
                                ))}
                            </View>
                            <Text style={[styles.avgText, { color: isDark ? '#fef3c7' : '#92400e' }]}>
                                {currentRating.average.toFixed(1)} ({currentRating.count} ratings)
                            </Text>
                        </View>
                    )}

                    {/* Rate Button - Students and Guards - Time-based availability */}
                    {(user?.role === 'student' || user?.role === 'guard') && (() => {
                        const ratingStatus = isRatingAvailable(selectedMeal, selectedDay);

                        if (!ratingStatus.canRate) {
                            const timing = timings?.[selectedMeal];
                            const now = nowIST();
                            const currentDayName = now.toLocaleDateString('en-IN', { weekday: 'long' }) as DayType;
                            const isDifferentDay = selectedDay !== currentDayName;

                            const [startHour, startMinute] = timing?.start.split(':').map(Number) || [0, 0];
                            const todayMealStart = new Date(now);
                            todayMealStart.setUTCHours(startHour, startMinute, 0, 0);

                            const isBeforeMeal = now < todayMealStart && !isDifferentDay;
                            const ratingWindowEnd = new Date(todayMealStart.getTime() + (12 * 60 * 60 * 1000));

                            const formatTimeRemaining = (targetDate: Date) => {
                                const diff = targetDate.getTime() - now.getTime();
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                if (hours > 0) {
                                    return `${hours}h ${minutes}m`;
                                }
                                return `${minutes}m`;
                            };

                            return (
                                <View style={[
                                    styles.ratingBlockedCard,
                                    {
                                        backgroundColor: isDark ? '#1f1f23' : '#f8fafc',
                                        borderColor: isDark ? '#3f3f46' : '#e2e8f0'
                                    }
                                ]}>
                                    {/* Icon and Title */}
                                    <View style={styles.ratingBlockedHeader}>
                                        <View style={[
                                            styles.ratingBlockedIcon,
                                            {
                                                backgroundColor: isDifferentDay
                                                    ? (isDark ? '#27272a' : '#f1f5f9')
                                                    : isBeforeMeal
                                                        ? (isDark ? '#422006' : '#fef3c7')
                                                        : (isDark ? '#3f1e1e' : '#fee2e2')
                                            }
                                        ]}>
                                            <Ionicons
                                                name={isDifferentDay ? "calendar-outline" : isBeforeMeal ? "time-outline" : "lock-closed-outline"}
                                                size={24}
                                                color={isDifferentDay ? colors.textSecondary : isBeforeMeal ? '#f59e0b' : '#ef4444'}
                                            />
                                        </View>
                                        <View style={styles.ratingBlockedContent}>
                                            <Text style={[
                                                styles.ratingBlockedTitle,
                                                { color: colors.text }
                                            ]}>
                                                {isDifferentDay
                                                    ? ratingStatus.message
                                                    : isBeforeMeal ? 'Rating Opens Soon' : 'Rating Window Closed'
                                                }
                                            </Text>
                                            <Text style={[
                                                styles.ratingBlockedSubtitle,
                                                { color: colors.textSecondary }
                                            ]}>
                                                {isDifferentDay
                                                    ? `You can only rate ${currentDayName}'s meals`
                                                    : isBeforeMeal
                                                        ? `${selectedMeal} starts at ${timing?.start}`
                                                        : `Rating period ended 12 hours after meal start`
                                                }
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Time Information */}
                                    <View style={[
                                        styles.ratingBlockedInfo,
                                        { backgroundColor: isDark ? '#27272a' : '#ffffff' }
                                    ]}>
                                        {isDifferentDay ? (
                                            <View style={styles.ratingInfoRow}>
                                                <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                                                <Text style={[styles.ratingInfoText, { color: colors.textSecondary }]}>
                                                    Switch to {currentDayName} to rate today's meals
                                                </Text>
                                            </View>
                                        ) : isBeforeMeal ? (
                                            <View style={styles.ratingInfoRow}>
                                                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                                                <Text style={[styles.ratingInfoText, { color: colors.textSecondary }]}>
                                                    Opens in {formatTimeRemaining(todayMealStart)}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.ratingInfoRow}>
                                                <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                                                <Text style={[styles.ratingInfoText, { color: colors.textSecondary }]}>
                                                    Rating window has closed for this meal
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        }

                        const timing = timings?.[selectedMeal];
                        const now = nowIST();
                        const currentDayName = now.toLocaleDateString('en-IN', { weekday: 'long' }) as DayType;
                        const [startHour, startMinute] = timing?.start.split(':').map(Number) || [0, 0];

                        // Calculate meal start for the SELECTED day, not current day
                        let mealStart: Date;
                        if (selectedDay !== currentDayName) {
                            // Yesterday's meal
                            mealStart = new Date(now);
                            mealStart.setUTCDate(mealStart.getUTCDate() - 1);
                            mealStart.setUTCHours(startHour, startMinute, 0, 0);
                        } else {
                            // Today's meal
                            mealStart = new Date(now);
                            mealStart.setUTCHours(startHour, startMinute, 0, 0);
                        }

                        const ratingWindowEnd = new Date(mealStart.getTime() + (12 * 60 * 60 * 1000));

                        const formatTimeRemaining = (targetDate: Date) => {
                            const diff = targetDate.getTime() - now.getTime();
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            if (hours > 0) {
                                return `${hours}h ${minutes}m`;
                            }
                            return `${minutes}m`;
                        };

                        // Check if meal has started
                        const mealNotStarted = now < mealStart;

                        return (
                            <>
                                <View style={[
                                    styles.ratingAvailableBanner,
                                    { backgroundColor: isDark ? '#1a2e1a' : '#f0fdf4', borderColor: isDark ? '#2d5f2d' : '#86efac' }
                                ]}>
                                    <Ionicons name="time-outline" size={16} color="#10b981" />
                                    <Text style={[styles.ratingAvailableText, { color: isDark ? '#86efac' : '#065f46' }]}>
                                        {mealNotStarted
                                            ? `Opens in ${formatTimeRemaining(mealStart)} at ${formatISTTime(mealStart)}`
                                            : `Rating closes in ${formatTimeRemaining(ratingWindowEnd)} at ${formatISTTime(ratingWindowEnd)}`
                                        }
                                    </Text>
                                </View>
                                <Pressable style={[styles.rateBtn, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]} onPress={() => setRatingMeal(selectedMeal)}>
                                    <Ionicons name="star" size={18} color="#f59e0b" />
                                    <Text style={[styles.rateBtnText, { color: isDark ? '#fef3c7' : '#92400e' }]}>
                                        {myCurrentRating ? `Your rating: ${myCurrentRating.rating}★` : 'Rate this meal'}
                                    </Text>
                                </Pressable>
                            </>
                        );
                    })()}

                    {/* Menu Items */}
                    <View style={styles.menuList}>
                        {currentMeals.length > 0 ? (
                            currentMeals.map((dish, index) => (
                                <View key={`${dish}-${index}`} style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                    <View style={[styles.dishIcon, { backgroundColor: colors.backgroundSecondary }]}>
                                        <Ionicons name="restaurant" size={18} color={colors.textSecondary} />
                                    </View>
                                    <Text style={[styles.dishName, { color: colors.text }]}>{dish}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={[styles.emptyMenu, { backgroundColor: colors.backgroundSecondary }]}>
                                <Ionicons name="restaurant-outline" size={48} color={colors.textTertiary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items for this meal</Text>
                                {isMessStaff && (
                                    <Pressable style={[styles.addItemBtn, { backgroundColor: colors.primary }]} onPress={handleEditMenu}>
                                        <Text style={styles.addItemText}>Add Items</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Edit Modal (Mess Staff) */}
            <Modal visible={showEditModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        >
                            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Edit {selectedMeal} - {selectedDay}</Text>
                                    <Pressable onPress={() => setShowEditModal(false)}>
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                                <Text style={[styles.modalHint, { color: colors.textSecondary }]}>Enter one item per line</Text>
                                <TextInput
                                    style={[styles.editInput, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    multiline
                                    numberOfLines={8}
                                    value={editItems}
                                    onChangeText={setEditItems}
                                    placeholder="Poha\nTea\nBread"
                                    placeholderTextColor={colors.textTertiary}
                                />
                                <Pressable
                                    style={[styles.saveBtn, { backgroundColor: colors.success }, updateMenuMutation.isPending && styles.btnDisabled]}
                                    onPress={handleSaveMenu}
                                    disabled={updateMenuMutation.isPending}
                                >
                                    {updateMenuMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.saveBtnText}>Save Menu</Text>
                                    )}
                                </Pressable>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Rating Modal (Students) */}
            < Modal visible={!!ratingMeal
            } animationType="fade" transparent >
                <View style={styles.ratingOverlay}>
                    <View style={[styles.ratingContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.ratingTitle, { color: colors.text }]}>Rate {ratingMeal}</Text>
                        <Text style={[styles.ratingSubtitle, { color: colors.textSecondary }]}>How was your meal today?</Text>
                        <View style={styles.ratingStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable key={star} onPress={() => handleRate(star)} style={styles.ratingStarBtn}>
                                    <Ionicons name="star" size={40} color="#f59e0b" />
                                    <Text style={[styles.ratingStarNum, { color: colors.textSecondary }]}>{star}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <Pressable style={styles.cancelBtn} onPress={() => setRatingMeal(null)}>
                            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal >

            {/* Timing Editor Modal (Mess Staff) */}
            <Modal visible={showTimingModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        >
                            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Meal Timings</Text>
                                    <Pressable onPress={() => setShowTimingModal(false)}>
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                                <Text style={[styles.modalHint, { color: colors.textSecondary }]}>Changing timings will create an urgent notice</Text>

                                {(['Breakfast', 'Lunch', 'Dinner'] as MealType[]).map((meal) => (
                                    <View key={meal} style={[styles.timingInputRow, { borderBottomColor: colors.cardBorder }]}>
                                        <Text style={[styles.timingLabel, { color: colors.text }]}>{meal}</Text>
                                        <View style={styles.timingPickerContainer}>
                                            <View style={styles.timePickerSection}>
                                                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Start</Text>
                                                <TimeScrollPicker
                                                    value={editTimings[meal]?.start || '07:00'}
                                                    onChange={(time) => {
                                                        setEditTimings({
                                                            ...editTimings,
                                                            [meal]: { ...editTimings[meal], start: time }
                                                        });
                                                    }}
                                                />
                                            </View>
                                            <Text style={[styles.timingDash, { color: colors.textSecondary }]}>→</Text>
                                            <View style={styles.timePickerSection}>
                                                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>End</Text>
                                                <TimeScrollPicker
                                                    value={editTimings[meal]?.end || '09:00'}
                                                    onChange={(time) => {
                                                        setEditTimings({
                                                            ...editTimings,
                                                            [meal]: { ...editTimings[meal], end: time }
                                                        });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                <Pressable
                                    style={[styles.saveBtn, { backgroundColor: colors.success }, updateTimingsMutation.isPending && styles.btnDisabled]}
                                    onPress={handleSaveTimings}
                                    disabled={updateTimingsMutation.isPending}
                                >
                                    {updateTimingsMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.saveBtnText}>Save Timings</Text>
                                    )}
                                </Pressable>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            <BottomNav />
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#737373' },
    error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorTitle: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#0a0a0a' },
    errorText: { marginTop: 8, color: '#737373' },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', padding: 14, borderRadius: 12 },
    editBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },
    daySelector: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
    dayBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, backgroundColor: '#f5f5f5', alignItems: 'center' },
    dayBtnActive: { backgroundColor: '#1d4ed8' },
    dayText: { fontSize: 14, fontWeight: '500', color: '#737373' },
    dayTextActive: { color: 'white' },
    todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#16a34a', marginTop: 4 },
    mealTabs: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 4, borderRadius: 12 },
    mealTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8 },
    mealTabActive: { backgroundColor: 'white' },
    mealText: { fontSize: 14, color: '#737373' },
    mealTextActive: { fontWeight: '500', color: '#0a0a0a' },
    timingBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8, backgroundColor: '#eff6ff', borderRadius: 8 },
    timingText: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
    avgRating: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#fef3c7', borderRadius: 12 },
    avgStars: { flexDirection: 'row', gap: 2 },
    avgText: { fontSize: 14, color: '#92400e' },
    rateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: '#fef3c7', borderRadius: 12 },
    rateBtnText: { color: '#92400e', fontWeight: '500' },
    menuList: { gap: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12 },
    dishIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
    dishName: { fontWeight: '500', color: '#0a0a0a', flex: 1 },
    emptyMenu: { alignItems: 'center', padding: 32, backgroundColor: '#fafafa', borderRadius: 12 },
    emptyText: { color: '#737373', marginTop: 12 },
    addItemBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#1d4ed8', borderRadius: 8 },
    addItemText: { color: 'white', fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '600', color: '#0a0a0a' },
    modalHint: { fontSize: 13, color: '#737373', marginBottom: 12 },
    editInput: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#fafafa', height: 200, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
    btnDisabled: { opacity: 0.7 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
    ratingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    ratingContent: { backgroundColor: 'white', borderRadius: 24, padding: 24, width: '90%', alignItems: 'center' },
    ratingTitle: { fontSize: 20, fontWeight: '600', color: '#0a0a0a' },
    ratingSubtitle: { fontSize: 14, color: '#737373', marginTop: 4, marginBottom: 24 },
    ratingStars: { flexDirection: 'row', gap: 8 },
    ratingStarBtn: { alignItems: 'center', padding: 8 },
    ratingStarNum: { fontSize: 12, color: '#737373', marginTop: 4 },
    cancelBtn: { marginTop: 24 },
    cancelBtnText: { color: '#737373', fontSize: 16 },
    // Rating disabled/blocked state - Premium card design
    ratingBlockedCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    ratingBlockedHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    ratingBlockedIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingBlockedContent: {
        flex: 1,
        gap: 4,
    },
    ratingBlockedTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    ratingBlockedSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    ratingBlockedInfo: {
        borderRadius: 12,
        padding: 12,
        gap: 10,
    },
    ratingInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingInfoText: {
        fontSize: 13,
        flex: 1,
    },
    ratingAvailableBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    ratingAvailableText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    // Timing editor styles
    editTimingBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#dbeafe', borderRadius: 6 },
    editTimingText: { fontSize: 12, fontWeight: '600', color: '#6366f1' },
    timingInputRow: { paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
    timingLabel: { fontSize: 16, fontWeight: '600' },
    timingPickerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 8, paddingVertical: 8 },
    timePickerSection: { alignItems: 'center', gap: 8 },
    timeLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase' },
    timingInputs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeInput: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, fontSize: 14, backgroundColor: '#fafafa', width: 70, textAlign: 'center' },
    timingDash: { fontSize: 20, fontWeight: '300' },
});
