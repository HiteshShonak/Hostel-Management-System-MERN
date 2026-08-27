import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { RatingStatusResult } from './useMealRatingStatus';

interface RatingAvailableBannerProps {
    status: RatingStatusResult;
    myCurrentRating?: { rating: number };
    onOpenRateModal: () => void;
}

export function RatingAvailableBanner({
    status,
    myCurrentRating,
    onOpenRateModal,
}: RatingAvailableBannerProps) {
    const { isDark } = useTheme();
    const {
        mealNotStarted,
        mealStart,
        ratingWindowEnd,
        formatTimeRemaining,
        formatISTTime,
    } = status;

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
            <Pressable
                style={[styles.rateBtn, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}
                onPress={onOpenRateModal}
            >
                <Ionicons name="star" size={18} color="#f59e0b" />
                <Text style={[styles.rateBtnText, { color: isDark ? '#fef3c7' : '#92400e' }]}>
                    {myCurrentRating ? `Your rating: ${myCurrentRating.rating}★` : 'Rate this meal'}
                </Text>
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    rateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12 },
    rateBtnText: { fontWeight: '500' },
    ratingAvailableBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    ratingAvailableText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
});
