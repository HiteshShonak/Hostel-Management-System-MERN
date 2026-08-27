import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface MealAverageRatingProps {
    rating?: { average: number; count: number };
}

export function MealAverageRating({ rating }: MealAverageRatingProps) {
    const { isDark } = useTheme();

    if (!rating) return null;

    return (
        <View style={[styles.avgRating, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
            <View style={styles.avgStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= Math.round(rating.average) ? 'star' : 'star-outline'}
                        size={20}
                        color="#f59e0b"
                    />
                ))}
            </View>
            <Text style={[styles.avgText, { color: isDark ? '#fef3c7' : '#92400e' }]}>
                {rating.average.toFixed(1)} ({rating.count} ratings)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avgRating: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12 },
    avgStars: { flexDirection: 'row', gap: 2 },
    avgText: { fontSize: 14 },
});
