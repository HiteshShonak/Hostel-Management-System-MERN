import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import type { Complaint } from '@/lib/types';

interface ComplaintStatsBarProps {
    complaints: Complaint[];
}

export function ComplaintStatsBar({ complaints }: ComplaintStatsBarProps) {
    const { colors, isDark } = useTheme();

    const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
    const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

    return (
        <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                <Text style={[styles.statNum, { color: isDark ? '#fca5a5' : '#0a0a0a' }]}>{pendingCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                <Text style={[styles.statNum, { color: isDark ? '#fcd34d' : '#0a0a0a' }]}>{inProgressCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                <Text style={[styles.statNum, { color: isDark ? '#86efac' : '#0a0a0a' }]}>{resolvedCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12 },
    statNum: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 13, marginTop: 4 },
});
