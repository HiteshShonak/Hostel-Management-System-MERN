import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

const STUDENT_QUICK_ACTIONS: DashboardActionItem[] = [
    {
        icon: 'qr-code',
        label: 'Gate Pass',
        route: '/shared/gate-pass',
        color: 'white',
        bg: '#3b82f6',
    },
    {
        icon: 'restaurant',
        label: 'Mess Menu',
        route: '/mess/mess-menu',
        color: 'white',
        bg: '#f97316',
    },
    {
        icon: 'warning',
        label: 'Complaints',
        route: '/shared/complaints',
        color: 'white',
        bg: '#f59e0b',
    },
    {
        icon: 'alert-circle',
        label: 'Emergency',
        route: '/shared/emergency',
        color: 'white',
        bg: '#ef4444',
    },
];

/**
 * Student Dashboard Quick Actions Bar.
 * Renders 4 primary shortcuts with branded icon backgrounds.
 */
export function QuickActions() {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>
            <DashboardActionGrid actions={STUDENT_QUICK_ACTIONS} variant="grid-4" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
});
