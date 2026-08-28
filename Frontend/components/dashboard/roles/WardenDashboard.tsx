import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { usePendingGatePasses, useActiveAlerts, useWardenDashboardStats } from '@/lib/hooks';
import { DashboardStatGrid, DashboardStatItem } from '@/components/ui/DashboardStatCard';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function WardenDashboard() {
    const { colors, isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();
    const { data: stats } = useWardenDashboardStats();

    const statItems: DashboardStatItem[] = [
        {
            icon: 'home',
            value: stats?.studentsInside || 0,
            label: 'Inside',
            color: '#16a34a',
            bgLight: '#f0fdf4',
            bgDark: '#052e16',
            route: '/warden/students',
        },
        {
            icon: 'walk',
            value: stats?.studentsOut || 0,
            label: 'Outside',
            color: '#f59e0b',
            bgLight: '#fff7ed',
            bgDark: '#431407',
            route: '/guard/students-out',
        },
        {
            icon: 'time',
            value: pendingPasses?.length || 0,
            label: 'Requests',
            color: '#d97706',
            bgLight: '#fef3c7',
            bgDark: '#451a03',
            route: '/shared/gate-pass',
        },
        {
            icon: 'warning',
            value: activeAlerts?.length || 0,
            label: 'Alerts',
            color: '#dc2626',
            bgLight: '#fef2f2',
            bgDark: '#450a0a',
            route: '/shared/emergency',
        },
    ];

    const quickActions: DashboardActionItem[] = [
        {
            icon: 'people',
            label: 'Students',
            route: '/warden/students',
            color: '#1d4ed8',
            bg: isDark ? '#172554' : '#eff6ff',
        },
        {
            icon: 'document-text',
            label: 'Pass History',
            route: '/warden/pass-history',
            color: '#4f46e5',
            bg: isDark ? '#1e1b4b' : '#e0e7ff',
        },
        {
            icon: 'restaurant',
            label: 'Mess Menu',
            route: '/mess/mess-menu',
            color: '#f97316',
            bg: isDark ? '#431407' : '#fff7ed',
        },
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
            icon: 'list',
            label: 'Logs',
            route: '/guard/activity-logs',
            color: '#1d4ed8',
            bg: isDark ? '#172554' : '#eff6ff',
        },
        {
            icon: 'alert-circle',
            label: 'SOS Alerts',
            route: '/shared/emergency',
            color: '#dc2626',
            bg: isDark ? '#450a0a' : '#fef2f2',
        },
        {
            icon: 'chatbox-ellipses',
            label: 'Complaints',
            route: '/shared/complaints',
            color: '#16a34a',
            bg: isDark ? '#052e16' : '#f0fdf4',
        },
    ];

    return (
        <View style={styles.wardenContent}>
            {/* Headcount and alert statistics */}
            <DashboardStatGrid items={statItems} />

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <DashboardActionGrid actions={quickActions} variant="grid-2" />
        </View>
    );
}

const styles = StyleSheet.create({
    wardenContent: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
});
