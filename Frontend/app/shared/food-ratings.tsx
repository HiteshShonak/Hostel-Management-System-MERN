import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useFoodRatingAverage, useRefreshDashboard } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';
import { formatDateYMD } from '@/lib/utils/date';
import { PastDateStrip, MealRatingCard, MEALS_CONFIG, FoodRatingsInfoCard } from '@/components/food-ratings';

export default function FoodRatingsPage() {
    const { colors } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(formatDateYMD(today));

    const { data: ratings, isLoading } = useFoodRatingAverage(selectedDate);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Meal Ratings" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Date Selector */}
                    <PastDateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

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
                                {MEALS_CONFIG.map(({ type, icon, color, colorDark }) => (
                                    <MealRatingCard
                                        key={type}
                                        type={type}
                                        icon={icon}
                                        color={color}
                                        colorDark={colorDark}
                                        rating={ratings[type]}
                                    />
                                ))}
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
                    <FoodRatingsInfoCard />
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    loadingContainer: {
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        gap: 12,
    },
    loadingText: { fontSize: 14 },
    mealsGrid: { gap: 16 },
    emptyState: {
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        gap: 8,
    },
    emptyTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 },
    emptyText: { fontSize: 13, textAlign: 'center' },
});
