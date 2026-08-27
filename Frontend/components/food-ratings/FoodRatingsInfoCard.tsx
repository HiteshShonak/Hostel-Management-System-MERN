import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

export function FoodRatingsInfoCard() {
    const { isDark } = useTheme();

    return (
        <View style={[
            styles.infoCard,
            {
                backgroundColor: isDark ? '#1c1c1e' : '#eff6ff',
                borderColor: isDark ? '#2c2c2e' : '#dbeafe'
            }
        ]}>
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
    );
}

const styles = StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        alignItems: 'flex-start',
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
        fontSize: 15,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 18,
    },
});
