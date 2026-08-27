import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { usePendingGatePasses, useActiveAlerts } from '@/lib/hooks';

// Admin dashboard component
export function AdminDashboard() {
    const { colors, isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();

    return (
        <View style={styles.adminContent}>
            {/* Admin header banner */}
            <View style={[styles.adminHeader, {
                backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                borderColor: isDark ? '#6b21a8' : '#e9d5ff'
            }]}>
                <View style={[styles.adminHeaderIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="shield-checkmark" size={32} color="#7c3aed" />
                </View>
                <View style={styles.adminHeaderText}>
                    <Text style={[styles.adminHeaderTitle, { color: isDark ? '#e9d5ff' : '#5b21b6' }]}>Admin Dashboard</Text>
                    <Text style={[styles.adminHeaderSubtitle, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Full system access</Text>
                </View>
            </View>

            {/* System alert and pass metrics */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#450a0a' : 'white' }]}>
                        <Ionicons name="warning" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{activeAlerts?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Alerts</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                        <Ionicons name="time" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{pendingPasses?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Passes</Text>
                </View>
            </View>

            {/* Administration section */}
            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Administration</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/users')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                        <Ionicons name="people" size={24} color="#7c3aed" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Users</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/link-parent')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="link" size={24} color="#b45309" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Link Parents</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/parent-links')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="git-network" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>View Links</Text>
                </Pressable>
            </View>

            {/* Gate Pass Management */}
            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Gate Pass Management</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/qr-scanner')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="scan" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Scan QR</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/gate-pass')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="checkmark-done" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Approve</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="footsteps" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
            </View>

            {/* Communication */}
            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Communication</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/notices')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="megaphone" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Notices</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/emergency')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                        <Ionicons name="alert-circle" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>SOS Alerts</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/complaints')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="chatbox-ellipses" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Complaints</Text>
                </Pressable>
            </View>

            {/* Mess Management */}
            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Mess Management</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess/mess-menu')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Mess Menu</Text>
                </Pressable>
            </View>

            {/* System Settings */}
            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>System Settings</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/stats')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="stats-chart" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Statistics</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/config')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#831843' : '#fce7f3' }]}>
                        <Ionicons name="settings" size={24} color="#db2777" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Config</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/students')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="people" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Students</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    adminContent: { padding: 16 },
    adminHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    adminHeaderIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    adminHeaderText: { flex: 1 },
    adminHeaderTitle: { fontSize: 22, fontWeight: '700' },
    adminHeaderSubtitle: { fontSize: 14, marginTop: 4 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statNumber: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 13, marginTop: 2 },
    adminSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    adminGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    adminCard: {
        width: '30%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    adminCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    adminCardLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
