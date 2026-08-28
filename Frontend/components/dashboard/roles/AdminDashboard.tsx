import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { usePendingGatePasses, useActiveAlerts } from '@/lib/hooks';
import { AdminDashboardBanner, AdminStatsGrid } from '@/components/admin';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function AdminDashboard() {
    const { isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();

    const administrationActions: DashboardActionItem[] = [
        { icon: 'people', label: 'Users', route: '/admin/users', color: '#7c3aed', bg: isDark ? '#3b0764' : '#f3e8ff' },
        { icon: 'link', label: 'Link Parents', route: '/admin/link-parent', color: '#b45309', bg: isDark ? '#451a03' : '#fef3c7' },
        { icon: 'git-network', label: 'View Links', route: '/admin/parent-links', color: '#16a34a', bg: isDark ? '#052e16' : '#dcfce7' },
    ];

    const gatePassActions: DashboardActionItem[] = [
        { icon: 'walk', label: 'Outside', route: '/guard/students-out', color: '#f59e0b', bg: isDark ? '#431407' : '#fff7ed' },
        { icon: 'enter', label: 'Entries', route: '/guard/recent-entries', color: '#16a34a', bg: isDark ? '#052e16' : '#f0fdf4' },
        { icon: 'footsteps', label: 'Logs', route: '/guard/activity-logs', color: '#4f46e5', bg: isDark ? '#1e1b4b' : '#e0e7ff' },
    ];

    const communicationActions: DashboardActionItem[] = [
        { icon: 'megaphone', label: 'Notices', route: '/shared/notices', color: '#d97706', bg: isDark ? '#451a03' : '#fef3c7' },
        { icon: 'alert-circle', label: 'SOS Alerts', route: '/shared/emergency', color: '#dc2626', bg: isDark ? '#450a0a' : '#fef2f2' },
        { icon: 'chatbox-ellipses', label: 'Complaints', route: '/shared/complaints', color: '#16a34a', bg: isDark ? '#052e16' : '#f0fdf4' },
    ];

    const messActions: DashboardActionItem[] = [
        { icon: 'restaurant', label: 'Mess Menu', route: '/mess/mess-menu', color: '#16a34a', bg: isDark ? '#052e16' : '#f0fdf4' },
    ];

    const systemActions: DashboardActionItem[] = [
        { icon: 'stats-chart', label: 'Statistics', route: '/admin/stats', color: '#4f46e5', bg: isDark ? '#1e1b4b' : '#e0e7ff' },
        { icon: 'settings', label: 'Config', route: '/admin/config', color: '#db2777', bg: isDark ? '#831843' : '#fce7f3' },
        { icon: 'people', label: 'Students', route: '/warden/students', color: '#16a34a', bg: isDark ? '#052e16' : '#dcfce7' },
    ];

    const titleColor = isDark ? '#a78bfa' : '#4c1d95';

    return (
        <View style={styles.adminContent}>
            <AdminDashboardBanner />

            {/* System alert and pass metrics */}
            <AdminStatsGrid
                activeAlertsCount={activeAlerts?.length || 0}
                pendingPassesCount={pendingPasses?.length || 0}
            />

            {/* Administration section */}
            <Text style={[styles.adminSectionTitle, { color: titleColor }]}>Administration</Text>
            <DashboardActionGrid actions={administrationActions} variant="grid-3" />

            {/* Gate Pass Management */}
            <Text style={[styles.adminSectionTitle, { color: titleColor }]}>Gate Pass Management</Text>
            <DashboardActionGrid actions={gatePassActions} variant="grid-3" />

            {/* Communication */}
            <Text style={[styles.adminSectionTitle, { color: titleColor }]}>Communication</Text>
            <DashboardActionGrid actions={communicationActions} variant="grid-3" />

            {/* Mess Management */}
            <Text style={[styles.adminSectionTitle, { color: titleColor }]}>Mess Management</Text>
            <DashboardActionGrid actions={messActions} variant="grid-3" />

            {/* System Settings */}
            <Text style={[styles.adminSectionTitle, { color: titleColor }]}>System Settings</Text>
            <DashboardActionGrid actions={systemActions} variant="grid-3" />
        </View>
    );
}

const styles = StyleSheet.create({
    adminContent: { padding: 16 },
    adminSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
});
