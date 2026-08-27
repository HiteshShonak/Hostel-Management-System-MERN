import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

// Parent dashboard component
export function ParentDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.parentContent}>
            {/* Header banner */}
            <View style={[styles.parentWelcome, {
                backgroundColor: isDark ? '#451a03' : '#fef3c7',
                borderColor: isDark ? '#92400e' : '#fcd34d'
            }]}>
                <View style={[styles.parentWelcomeIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="people" size={32} color="#b45309" />
                </View>
                <View style={styles.parentWelcomeText}>
                    <Text style={[styles.parentWelcomeTitle, { color: isDark ? '#fbbf24' : '#92400e' }]}>Parent Dashboard</Text>
                    <Text style={[styles.parentWelcomeSubtitle, { color: isDark ? '#fcd34d' : '#b45309' }]}>Monitor your child's activities</Text>
                </View>
            </View>

            {/* Linked children section */}
            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>My Children</Text>
            <Pressable style={[styles.parentActionCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/children')}>
                <View style={[styles.parentActionIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                    <Ionicons name="people-circle" size={28} color="#b45309" />
                </View>
                <View style={styles.parentActionInfo}>
                    <Text style={[styles.parentActionTitle, { color: colors.text }]}>View Children</Text>
                    <Text style={[styles.parentActionSubtitle, { color: colors.textSecondary }]}>See linked students and their details</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#b45309" />
            </Pressable>

            {/* Gate pass approvals */}
            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>Gate Pass Approvals</Text>
            <View style={styles.parentGrid}>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/pending-passes')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="time" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>Pending</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>Awaiting approval</Text>
                </Pressable>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/pass-history')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="checkmark-done" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>History</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>All gate passes</Text>
                </Pressable>
            </View>

            {/* General communications */}
            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>General</Text>
            <Pressable style={[styles.parentActionCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/notices')}>
                <View style={[styles.parentActionIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="megaphone" size={28} color="#1d4ed8" />
                </View>
                <View style={styles.parentActionInfo}>
                    <Text style={[styles.parentActionTitle, { color: colors.text }]}>Notices</Text>
                    <Text style={[styles.parentActionSubtitle, { color: colors.textSecondary }]}>View hostel announcements</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#1d4ed8" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    parentContent: { padding: 16 },
    parentWelcome: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    parentWelcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    parentWelcomeText: { flex: 1 },
    parentWelcomeTitle: { fontSize: 22, fontWeight: '700' },
    parentWelcomeSubtitle: { fontSize: 14, marginTop: 4 },
    parentSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    parentActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    parentActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    parentActionInfo: { flex: 1 },
    parentActionTitle: { fontSize: 16, fontWeight: '600' },
    parentActionSubtitle: { fontSize: 13, marginTop: 2 },
    parentGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    parentGridCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    parentGridIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    parentGridLabel: { fontSize: 15, fontWeight: '600' },
    parentGridSubtext: { fontSize: 13, marginTop: 2 },
});
