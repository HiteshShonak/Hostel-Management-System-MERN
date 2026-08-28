import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import { DashboardHeaderBanner } from '@/components/ui/DashboardHeaderBanner';
import { DashboardActionGrid, DashboardActionItem } from '@/components/ui/DashboardActionCard';

export function HelperDashboard() {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();

    const actions: DashboardActionItem[] = [
        {
            icon: 'person-add',
            label: 'Register User',
            subtitle: 'Create accounts for any role',
            color: '#6366f1',
            bg: isDark ? '#312e81' : '#e0e7ff',
            cardBg: isDark ? '#1e1b4b' : '#eef2ff',
            route: '/helper/register-user',
        },
        {
            icon: 'key',
            label: 'Reset Password',
            subtitle: 'Force-reset any user password',
            color: '#ef4444',
            bg: isDark ? '#450a0a' : '#fee2e2',
            cardBg: isDark ? '#3a0808' : '#fef2f2',
            route: '/helper/reset-password',
        },
    ];

    return (
        <View style={styles.helperContent}>
            {/* Identity banner */}
            <DashboardHeaderBanner
                icon="person-add"
                title="Helper Panel"
                subtitle={`Logged in as ${user?.name || 'Staff'}`}
                accentText="Registration & identity management"
                iconColor="#6366f1"
                bgLight="#eef2ff"
                bgDark="#1e1b4b"
                borderLight="#c7d2fe"
                borderDark="#3730a3"
            />

            {/* Quick Actions */}
            <Text style={[styles.helperSectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <DashboardActionGrid actions={actions} variant="action-row" />

            {/* Operational notice */}
            <View style={[styles.helperNote, { backgroundColor: isDark ? '#172554' : '#eff6ff', borderColor: isDark ? '#1e3a8a' : '#bfdbfe' }]}>
                <Ionicons name="information-circle-outline" size={18} color={isDark ? '#93c5fd' : '#2563eb'} />
                <Text style={[styles.helperNoteText, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                    As a Helper, you can register accounts for all user types. New users must login separately with their own credentials.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    helperContent: { padding: 16, gap: 16 },
    helperSectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
    helperNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 4,
    },
    helperNoteText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
