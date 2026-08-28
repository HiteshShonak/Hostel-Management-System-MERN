import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { RecentNotices } from '@/components/dashboard/recent-notices';
import { DashboardHeaderBanner } from '@/components/ui/DashboardHeaderBanner';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function GuardDashboard() {
    const { colors, isDark } = useTheme();

    const quickActions: DashboardActionItem[] = [
        {
            icon: 'walk',
            label: 'Outside',
            route: '/guard/students-out',
            color: '#f59e0b',
            bg: isDark ? '#431407' : '#fff7ed',
        },
        {
            icon: 'enter',
            label: 'Entries',
            route: '/guard/recent-entries',
            color: '#16a34a',
            bg: isDark ? '#052e16' : '#f0fdf4',
        },
        {
            icon: 'footsteps',
            label: 'Logs',
            route: '/guard/activity-logs',
            color: '#4f46e5',
            bg: isDark ? '#1e1b4b' : '#e0e7ff',
        },
        {
            icon: 'restaurant',
            label: 'Mess Menu',
            route: '/mess/mess-menu',
            color: '#16a34a',
            bg: isDark ? '#052e16' : '#f0fdf4',
        },
    ];

    return (
        <View style={styles.guardContent}>
            {/* Primary QR verification banner */}
            <DashboardHeaderBanner
                icon="scan"
                title="Scan Gate Pass"
                subtitle="Verify student entry/exit"
                iconColor={isDark ? '#22c55e' : '#16a34a'}
                bgLight="#dcfce7"
                bgDark="#052e16"
                borderLight="#bbf7d0"
                borderDark="#14532d"
                route="/shared/qr-scanner"
                showChevron
            />

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <DashboardActionGrid actions={quickActions} variant="grid-2" />

            <RecentNotices />
        </View>
    );
}

const styles = StyleSheet.create({
    guardContent: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
});
