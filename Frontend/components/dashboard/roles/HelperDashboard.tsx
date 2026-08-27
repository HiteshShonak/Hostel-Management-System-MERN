import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';

// Helper dashboard component
export function HelperDashboard() {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();

    const actions = [
        {
            icon: 'person-add' as const,
            label: 'Register User',
            subtitle: 'Create accounts for any role',
            color: '#6366f1',
            bg: isDark ? '#1e1b4b' : '#eef2ff',
            route: '/helper/register-user' as const,
        },
        {
            icon: 'key' as const,
            label: 'Reset Password',
            subtitle: 'Force-reset any user password',
            color: '#ef4444',
            bg: isDark ? '#450a0a' : '#fef2f2',
            route: '/helper/reset-password' as const,
        },
    ];

    return (
        <View style={styles.helperContent}>
            {/* Identity banner */}
            <View style={[styles.helperBanner, {
                backgroundColor: isDark ? '#1e1b4b' : '#eef2ff',
                borderColor: isDark ? '#3730a3' : '#c7d2fe',
            }]}>
                <View style={[styles.helperBannerIcon, { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
                    <Ionicons name="person-add" size={28} color="#6366f1" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.helperBannerTitle, { color: colors.text }]}>Helper Panel</Text>
                    <Text style={[styles.helperBannerSub, { color: colors.textSecondary }]}>
                        Logged in as {user?.name}
                    </Text>
                    <Text style={[styles.helperBannerAccent, { color: isDark ? '#818cf8' : '#6366f1' }]}>
                        Registration & identity management
                    </Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.helperSectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.helperActions}>
                {actions.map((action) => (
                    <Pressable
                        key={action.route}
                        style={[styles.helperActionCard, { backgroundColor: action.bg, borderColor: `${action.color}40` }]}
                        onPress={() => router.push(action.route)}
                    >
                        <View style={[styles.helperActionIcon, { backgroundColor: `${action.color}22` }]}>
                            <Ionicons name={action.icon} size={28} color={action.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.helperActionLabel, { color: colors.text }]}>{action.label}</Text>
                            <Text style={[styles.helperActionSub, { color: colors.textSecondary }]}>{action.subtitle}</Text>
                        </View>
                        <View style={[styles.helperActionArrow, { backgroundColor: `${action.color}22` }]}>
                            <Ionicons name="chevron-forward" size={16} color={action.color} />
                        </View>
                    </Pressable>
                ))}
            </View>

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
    helperContent: { padding: 16, gap: 20 },
    helperBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    helperBannerIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperBannerTitle: { fontSize: 20, fontWeight: '800' },
    helperBannerSub: { fontSize: 13, marginTop: 2 },
    helperBannerAccent: { fontSize: 12, fontWeight: '600', marginTop: 4 },
    helperSectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
    helperActions: { gap: 14 },
    helperActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        borderRadius: 18,
        borderWidth: 1.5,
    },
    helperActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperActionLabel: { fontSize: 17, fontWeight: '700' },
    helperActionSub: { fontSize: 13, marginTop: 3 },
    helperActionArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    helperNoteText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
