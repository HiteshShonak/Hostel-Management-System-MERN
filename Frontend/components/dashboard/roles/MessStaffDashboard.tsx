import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { RecentNotices } from '@/components/dashboard/recent-notices';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function MessStaffDashboard() {
    const { colors, isDark } = useTheme();

    const quickActions: DashboardActionItem[] = [
        {
            icon: 'restaurant',
            label: 'Edit Menu',
            route: '/mess/mess-menu',
            color: '#16a34a',
            bg: isDark ? '#052e16' : '#f0fdf4',
        },
        {
            icon: 'star',
            label: 'View Ratings',
            route: '/shared/food-ratings',
            color: '#d97706',
            bg: isDark ? '#451a03' : '#fef3c7',
        },
    ];

    return (
        <View style={styles.staffContent}>
            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Quick Actions
            </Text>

            {/* 2-Column Action Grid */}
            <DashboardActionGrid actions={quickActions} variant="grid-2" />

            {/* Recent hostel notices */}
            <RecentNotices />
        </View>
    );
}

const styles = StyleSheet.create({
    staffContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
});
