import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { usePendingGatePasses, useActiveAlerts, useWardenDashboardStats } from '@/lib/hooks';

// Warden dashboard component
export function WardenDashboard() {
    const { colors, isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();
    const { data: stats } = useWardenDashboardStats();

    return (
        <View style={styles.wardenContent}>
            {/* Headcount and alert statistics (Interactive Shortcuts) */}
            <View style={styles.statsGrid}>
                <Pressable
                    style={[styles.statCard, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}
                    onPress={() => router.push('/warden/students')}
                >
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#052e16' : 'white' }]}>
                        <Ionicons name="home" size={22} color="#16a34a" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.studentsInside || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inside</Text>
                </Pressable>
                <Pressable
                    style={[styles.statCard, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}
                    onPress={() => router.push('/guard/students-out')}
                >
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                        <Ionicons name="walk" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.studentsOut || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Outside</Text>
                </Pressable>
                <Pressable
                    style={[styles.statCard, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}
                    onPress={() => router.push('/shared/gate-pass')}
                >
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                        <Ionicons name="time" size={22} color="#d97706" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{pendingPasses?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Requests</Text>
                </Pressable>
                <Pressable
                    style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}
                    onPress={() => router.push('/shared/emergency')}
                >
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#450a0a' : 'white' }]}>
                        <Ionicons name="warning" size={22} color="#dc2626" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{activeAlerts?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Alerts</Text>
                </Pressable>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/students')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="people" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Students</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/pass-history')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="document-text" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Pass History</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess/mess-menu')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="restaurant" size={24} color="#f97316" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Mess Menu</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="list" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/emergency')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                        <Ionicons name="alert-circle" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>SOS Alerts</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/complaints')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="chatbox-ellipses" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Complaints</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wardenContent: { padding: 16 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    statCard: { width: '48%', padding: 16, borderRadius: 14, alignItems: 'center' },
    statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statNumber: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 13, marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    quickCard: { width: '47%', padding: 16, borderRadius: 16, alignItems: 'center' },
    quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    quickLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
