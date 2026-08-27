import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { MealType } from '@/lib/types';

export const MEALS_CONFIG: { type: MealType; icon: string; color: string; colorDark: string }[] = [
    { type: 'Breakfast', icon: 'cafe', color: '#f59e0b', colorDark: '#fbbf24' },
    { type: 'Lunch', icon: 'sunny', color: '#f97316', colorDark: '#fb923c' },
    { type: 'Dinner', icon: 'moon', color: '#6366f1', colorDark: '#818cf8' },
];

interface MealRatingCardProps {
    type: MealType;
    icon: string;
    color: string;
    colorDark: string;
    rating?: { average: number; count: number };
}

export function MealRatingCard({ type, icon, color, colorDark, rating }: MealRatingCardProps) {
    const { colors, isDark } = useTheme();
    const actualColor = isDark ? colorDark : color;

    const renderStarRating = (score: number) => {
        return (
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= Math.round(score) ? 'star' : 'star-outline'}
                        size={20}
                        color="#f59e0b"
                    />
                ))}
            </View>
        );
    };

    if (!rating || rating.count === 0) {
        return (
            <View style={[styles.mealCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={[styles.mealIcon, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5' }]}>
                    <Ionicons name={icon as any} size={28} color={actualColor} />
                </View>
                <Text style={[styles.mealName, { color: colors.text }]}>{type}</Text>
                <Text style={[styles.noRatings, { color: colors.textTertiary }]}>No ratings yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.mealCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.mealIcon, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5' }]}>
                <Ionicons name={icon as any} size={28} color={actualColor} />
            </View>
            <Text style={[styles.mealName, { color: colors.text }]}>{type}</Text>

            {/* Star Rating */}
            {renderStarRating(rating.average)}

            {/* Average Score */}
            <Text style={[styles.averageScore, { color: colors.text }]}>
                {rating.average.toFixed(1)} / 5.0
            </Text>

            {/* Rating Count */}
            <View style={[styles.ratingCount, { backgroundColor: isDark ? '#2c2c2e' : '#f5f5f5' }]}>
                <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.ratingCountText, { color: colors.textSecondary }]}>
                    {rating.count} {rating.count === 1 ? 'rating' : 'ratings'}
                </Text>
            </View>

            {/* Emoji Indicator */}
            <Text style={styles.emojiIndicator}>
                {rating.average >= 4.5 ? '🌟' :
                    rating.average >= 3.5 ? '😊' :
                        rating.average >= 2.5 ? '😐' : '😞'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    mealCard: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        gap: 8,
    },
    mealIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    mealName: { fontSize: 18, fontWeight: '700' },
    noRatings: { fontSize: 14, fontStyle: 'italic', marginTop: 8 },
    starsRow: { flexDirection: 'row', gap: 4, marginVertical: 4 },
    averageScore: { fontSize: 24, fontWeight: '800' },
    ratingCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 4,
    },
    ratingCountText: { fontSize: 13, fontWeight: '500' },
    emojiIndicator: { fontSize: 28, marginTop: 4 },
});
