import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useSystemStats } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function AdminStatsScreen() {
    const { colors, isDark } = useTheme();
    const { data: stats, isLoading, refetch } = useSystemStats();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="System Statistics" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="System Statistics" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

                {/* Users Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people" size={22} color={isDark ? '#a5b4fc' : '#4f46e5'} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Users</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.users?.total || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Users</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#86efac' : '#16a34a' }]}>{stats?.users?.byRole?.student || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Students</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>{stats?.users?.byRole?.warden || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wardens</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#7dd3fc' : '#0284c7' }]}>{stats?.users?.byRole?.parent || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Parents</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#fdba74' : '#ea580c' }]}>{stats?.users?.byRole?.mess_staff || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mess Staff</Text>
                        </View>
                    </View>
                </View>

                {/* Gate Passes Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text" size={22} color={isDark ? '#fcd34d' : '#d97706'} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Gate Passes</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.gatePasses?.total || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Passes</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#86efac' : '#16a34a' }]}>{stats?.gatePasses?.approved || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Approved</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#fcd34d' : '#f59e0b' }]}>{stats?.gatePasses?.pending || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#fca5a5' : '#dc2626' }]}>{stats?.gatePasses?.rejected || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rejected</Text>
                        </View>
                    </View>
                </View>

                {/* Attendance Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="checkmark-circle" size={22} color={isDark ? '#86efac' : '#16a34a'} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendance</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.attendance?.monthlyRecords || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Monthly Records</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#86efac' : '#16a34a' }]}>{stats?.attendance?.averagePercentage || 0}%</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Average %</Text>
                        </View>
                    </View>
                </View>

                {/* Other Stats */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="grid" size={22} color={isDark ? '#fca5a5' : '#dc2626'} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Other</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.notices || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Notices</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#fca5a5' : '#dc2626' }]}>{stats?.pendingComplaints || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Complaints</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    section: { borderRadius: 16, padding: 16, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statBox: { width: '47%', borderRadius: 12, padding: 14, alignItems: 'center' },
    statNumber: { fontSize: 28, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
});
