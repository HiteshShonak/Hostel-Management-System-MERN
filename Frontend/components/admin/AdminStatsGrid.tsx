import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DashboardStatGrid, DashboardStatItem } from '@/components/ui/DashboardStatCard';

export interface AdminStatsGridProps {
    activeAlertsCount: number;
    pendingPassesCount: number;
}

/**
 * Top interactive metric cards for Admin dashboard.
 * Displays interactive summary for Active Alerts and Pending Gate Passes with one-tap navigation.
 */
export function AdminStatsGrid({
    activeAlertsCount,
    pendingPassesCount,
}: AdminStatsGridProps) {
    const statItems: DashboardStatItem[] = [
        {
            icon: 'warning',
            value: activeAlertsCount,
            label: 'Active Alerts',
            color: '#dc2626',
            bgLight: '#fef2f2',
            bgDark: '#450a0a',
            route: '/shared/emergency',
        },
        {
            icon: 'time',
            value: pendingPassesCount,
            label: 'Pending Passes',
            color: '#f59e0b',
            bgLight: '#fef3c7',
            bgDark: '#451a03',
            route: '/shared/gate-pass',
        },
    ];

    return (
        <View style={styles.container}>
            <DashboardStatGrid items={statItems} gap={12} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 4,
    },
});
