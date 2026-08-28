import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { DashboardHeaderBanner } from '@/components/ui/DashboardHeaderBanner';
import { DashboardActionCard, DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function ParentDashboard() {
    const { isDark } = useTheme();

    const passApprovalActions: DashboardActionItem[] = [
        {
            icon: 'time',
            label: 'Pending',
            subtitle: 'Awaiting approval',
            route: '/parent/pending-passes',
            color: '#d97706',
            bg: isDark ? '#451a03' : '#fef3c7',
        },
        {
            icon: 'checkmark-done',
            label: 'History',
            subtitle: 'All gate passes',
            route: '/parent/pass-history',
            color: '#16a34a',
            bg: isDark ? '#052e16' : '#dcfce7',
        },
    ];

    const sectionTitleColor = isDark ? '#fbbf24' : '#78350f';

    return (
        <View style={styles.parentContent}>
            {/* Header banner */}
            <DashboardHeaderBanner
                icon="people"
                title="Parent Dashboard"
                subtitle="Monitor your child's activities"
                iconColor="#b45309"
                bgLight="#fef3c7"
                bgDark="#451a03"
                borderLight="#fcd34d"
                borderDark="#92400e"
            />

            {/* Linked children section */}
            <Text style={[styles.parentSectionTitle, { color: sectionTitleColor }]}>My Children</Text>
            <DashboardActionCard
                icon="people-circle"
                label="View Children"
                subtitle="See linked students and their details"
                route="/parent/children"
                color="#b45309"
                bg={isDark ? '#451a03' : '#fef3c7'}
                variant="list-card"
            />

            {/* Gate pass approvals */}
            <Text style={[styles.parentSectionTitle, { color: sectionTitleColor }]}>Gate Pass Approvals</Text>
            <DashboardActionGrid actions={passApprovalActions} variant="grid-2" />

            {/* General communications */}
            <Text style={[styles.parentSectionTitle, { color: sectionTitleColor }]}>General</Text>
            <DashboardActionCard
                icon="megaphone"
                label="Notices"
                subtitle="View hostel announcements"
                route="/shared/notices"
                color="#1d4ed8"
                bg={isDark ? '#172554' : '#eff6ff'}
                variant="list-card"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    parentContent: { padding: 16 },
    parentSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
});
