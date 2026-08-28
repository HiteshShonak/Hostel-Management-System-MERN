import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface ActivityStatsBarProps {
    exitCount: number;
    entryCount: number;
    totalCount: number;
}

export function ActivityStatsBar({ exitCount, entryCount, totalCount }: ActivityStatsBarProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.statsBar, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
            <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                    <Ionicons name="exit-outline" size={18} color="#f59e0b" />
                </View>
                <View>
                    <Text style={[styles.statValue, { color: colors.text }]}>{exitCount}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exits</Text>
                </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                    <Ionicons name="enter-outline" size={18} color="#16a34a" />
                </View>
                <View>
                    <Text style={[styles.statValue, { color: colors.text }]}>{entryCount}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Entries</Text>
                </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
                    <Ionicons name="list" size={18} color="#1d4ed8" />
                </View>
                <View>
                    <Text style={[styles.statValue, { color: colors.text }]}>{totalCount}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsBar: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 20, fontWeight: '700' },
    statLabel: { fontSize: 13, fontWeight: '500' },
    statDivider: { width: 1, marginHorizontal: 8 },
});
