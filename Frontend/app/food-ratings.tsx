import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useFoodRatingAverage, useRefreshDashboard } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import type { MealType } from '@/lib/types';
import { nowIST, startOfDay } from '@/lib/utils/date';

const MEALS: { type: MealType; icon: string; color: string; colorDark: string }[] = [
    { type: 'Breakfast', icon: 'cafe', color: '#f59e0b', colorDark: '#fbbf24' },
    { type: 'Lunch', icon: 'sunny', color: '#f97316', colorDark: '#fb923c' },
    { type: 'Dinner', icon: 'moon', color: '#6366f1', colorDark: '#818cf8' },
];

export default function FoodRatingsPage() {
    const { colors, isDark } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const dateScrollRef = useRef<ScrollView>(null);

    // Get today's date in IST
    const today = nowIST();
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

    const { data: ratings, isLoading } = useFoodRatingAverage(selectedDate);

    // Generate past week dates in IST
    const getPastWeekDates = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = nowIST();
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    };

    const pastWeekDates = getPastWeekDates();

    // Auto-scroll to today's date on mount
    useEffect(() => {
        // Scroll to the end (today) after component mounts
        setTimeout(() => {
            dateScrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    const formatDate = (date: Date) => {
        const day = date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dayNum = date.getDate();
        return { day, dayNum };
    };

    const isToday = (date: Date) => {
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    };

    const isSelected = (date: Date) => {
        return date.toISOString().split('T')[0] === selectedDate;
    };

    const renderStarRating = (rating: number) => {
        return (
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= Math.round(rating) ? 'star' : 'star-outline'}
                        size={20}
                        color="#f59e0b"
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Meal Ratings" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Date Selector */}
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
                        <ScrollView
                            ref={dateScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.dateScrollContent}
                        >
                            {pastWeekDates.map((date, index) => {
                                const { day, dayNum } = formatDate(date);
                                const selected = isSelected(date);
                                const todayCheck = isToday(date);

                                return (
                                    <Pressable
                                        key={date.toISOString()}
                                        onPress={() => setSelectedDate(date.toISOString().split('T')[0])}
                                        style={[
                                            styles.dateCard,
                                            {
                                                backgroundColor: selected
                                                    ? colors.primary
                                                    : colors.card,
                                                borderColor: selected
                                                    ? colors.primary
                                                    : colors.cardBorder,
                                                marginLeft: index === 0 ? 16 : 0,
                                                marginRight: index === pastWeekDates.length - 1 ? 16 : 10,
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.dateDayLabel,
                                            { color: selected ? '#fff' : colors.textSecondary }
                                        ]}>
                                            {day}
                                        </Text>
                                        <Text style={[
                                            styles.dateDayNum,
                                            { color: selected ? '#fff' : colors.text }
                                        ]}>
                                            {dayNum}
                                        </Text>
                                        {todayCheck && (
                                            <View style={[styles.todayIndicator, { backgroundColor: selected ? '#fff' : colors.success }]} />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Ratings Overview */}
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ratings Overview</Text>

                        {/* Loading State */}
                        {isLoading ? (
                            <View style={[styles.loadingContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading ratings...</Text>
                            </View>
                        ) : ratings ? (
                            <View style={styles.mealsGrid}>
                                {MEALS.map(({ type, icon, color, colorDark }) => {
                                    const mealRating = ratings[type];
                                    const actualColor = isDark ? colorDark : color;

                                    if (!mealRating || mealRating.count === 0) {
                                        return (
                                            <View
                                                key={type}
                                                style={[
                                                    styles.mealCard,
                                                    {
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.cardBorder
                                                    }
                                                ]}
                                            >
                                                <View style={[styles.mealIcon, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5' }]}>
                                                    <Ionicons name={icon as any} size={28} color={actualColor} />
                                                </View>
                                                <Text style={[styles.mealName, { color: colors.text }]}>{type}</Text>
                                                <Text style={[styles.noRatings, { color: colors.textTertiary }]}>No ratings yet</Text>
                                            </View>
                                        );
                                    }

                                    return (
                                        <View
                                            key={type}
                                            style={[
                                                styles.mealCard,
                                                {
                                                    backgroundColor: colors.card,
                                                    borderColor: colors.cardBorder
                                                }
                                            ]}
                                        >
                                            <View style={[styles.mealIcon, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5' }]}>
                                                <Ionicons name={icon as any} size={28} color={actualColor} />
                                            </View>
                                            <Text style={[styles.mealName, { color: colors.text }]}>{type}</Text>

                                            {/* Star Rating */}
                                            {renderStarRating(mealRating.average)}

                                            {/* Average Score */}
                                            <Text style={[styles.averageScore, { color: colors.text }]}>
                                                {mealRating.average.toFixed(1)} / 5.0
                                            </Text>

                                            {/* Rating Count */}
                                            <View style={[styles.ratingCount, { backgroundColor: isDark ? '#2c2c2e' : '#f5f5f5' }]}>
                                                <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                                                <Text style={[styles.ratingCountText, { color: colors.textSecondary }]}>
                                                    {mealRating.count} {mealRating.count === 1 ? 'rating' : 'ratings'}
                                                </Text>
                                            </View>

                                            {/* Emoji Indicator */}
                                            <Text style={styles.emojiIndicator}>
                                                {mealRating.average >= 4.5 ? '🌟' :
                                                    mealRating.average >= 3.5 ? '😊' :
                                                        mealRating.average >= 2.5 ? '😐' : '😞'}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                <Ionicons name="bar-chart-outline" size={48} color={colors.textTertiary} />
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Ratings Available</Text>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Students haven't rated meals for this date yet
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Info Card */}
                    <View style={[styles.infoCard, {
                        backgroundColor: isDark ? '#1c1c1e' : '#eff6ff',
                        borderColor: isDark ? '#2c2c2e' : '#dbeafe'
                    }]}>
                        <View style={[styles.infoIcon, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]}>
                            <Ionicons name="information-circle" size={24} color="#6366f1" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                                About Ratings
                            </Text>
                            <Text style={[styles.infoText, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                                Students and guards can rate meals on a scale of 1-5 stars. Use this feedback to improve meal quality and variety.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    content: {
        padding: 16,
        gap: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    dateScrollContent: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    dateCard: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 60,
        position: 'relative',
    },
    dateDayLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    dateDayNum: {
        fontSize: 20,
        fontWeight: '700',
    },
    todayIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    mealsGrid: {
        gap: 12,
    },
    mealCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    mealIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    mealName: {
        fontSize: 18,
        fontWeight: '600',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 4,
    },
    averageScore: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
    },
    ratingCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    ratingCountText: {
        fontSize: 13,
        fontWeight: '500',
    },
    emojiIndicator: {
        fontSize: 32,
        marginTop: 8,
    },
    noRatings: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 16,
        borderWidth: 1,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        maxWidth: 250,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 48,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 18,
    },
});
