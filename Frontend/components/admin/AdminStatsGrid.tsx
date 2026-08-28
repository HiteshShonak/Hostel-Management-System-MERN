import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

interface AdminStatsGridProps {
    activeAlertsCount: number;
    pendingPassesCount: number;
}

/**
 * Top interactive metric cards for Admin dashboard.
 */
export function AdminStatsGrid({
    activeAlertsCount,
    pendingPassesCount,
}: AdminStatsGridProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.statsRow}>
            <Pressable
                style={[
                    styles.statCard,
                    { backgroundColor: isDark ? '#450a0a' : '#fef2f2' },
                ]}
                onPress={() => router.push('/shared/emergency')}
            >
                <View style={[styles.statIcon, { backgroundColor: isDark ? '#450a0a' : 'white' }]}>
                    <Ionicons name="warning" size={24} color="#dc2626" />
                </View>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                    {activeAlertsCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Active Alerts
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.statCard,
                    { backgroundColor: isDark ? '#451a03' : '#fef3c7' },
                ]}
                onPress={() => router.push('/shared/gate-pass')}
            >
                <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                    <Ionicons name="time" size={24} color="#f59e0b" />
                </View>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                    {pendingPassesCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Pending Passes
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 13,
        marginTop: 2,
    },
});
