import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { MealType } from '@/lib/types';
import type { RatingStatusResult } from './useMealRatingStatus';

interface RatingBlockedCardProps {
    status: RatingStatusResult;
    selectedMeal: MealType;
}

export function RatingBlockedCard({ status, selectedMeal }: RatingBlockedCardProps) {
    const { colors, isDark } = useTheme();
    const {
        message,
        isDifferentDay,
        isBeforeMeal,
        currentDayName,
        timing,
        mealStart,
        formatTimeRemaining,
    } = status;

    return (
        <View style={[
            styles.ratingBlockedCard,
            {
                backgroundColor: isDark ? '#1f1f23' : '#f8fafc',
                borderColor: isDark ? '#3f3f46' : '#e2e8f0'
            }
        ]}>
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
                    <Text style={[styles.ratingBlockedTitle, { color: colors.text }]}>
                        {isDifferentDay
                            ? message
                            : isBeforeMeal ? 'Rating Opens Soon' : 'Rating Window Closed'
                        }
                    </Text>
                    <Text style={[styles.ratingBlockedSubtitle, { color: colors.textSecondary }]}>
                        {isDifferentDay
                            ? `You can only rate ${currentDayName}'s meals`
                            : isBeforeMeal
                                ? `${selectedMeal} starts at ${timing?.start}`
                                : `Rating period ended 12 hours after meal start`
                        }
                    </Text>
                </View>
            </View>

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
                            Opens in {formatTimeRemaining(mealStart)}
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

const styles = StyleSheet.create({
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
});
