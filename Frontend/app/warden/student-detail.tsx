import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useStudentDetail, useWardenMarkAttendance } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function StudentDetailScreen() {
    const { colors, isDark } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, isLoading, refetch } = useStudentDetail(id || '');
    const markAttendanceMutation = useWardenMarkAttendance();

    if (isLoading || !data) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Student Details" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    const { student, attendance, passes } = data;

    const handleMarkAttendance = () => {
        if (attendance.markedToday) {
            Alert.alert('Already Marked', 'Attendance is already marked for today.');
            return;
        }

        Alert.alert(
            'Mark Attendance',
            `Mark attendance for ${student.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            await markAttendanceMutation.mutateAsync(student._id);
                            Alert.alert('Success', 'Attendance marked successfully');
                            refetch();
                        } catch (error: unknown) {
                            const message = error instanceof Error ? error.message : 'Failed to mark attendance';
                            Alert.alert('Error', message);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Student Details" showBack />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {student.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                    <Text style={[styles.studentEmail, { color: colors.textSecondary }]}>{student.email}</Text>

                    {/* Status Badges */}
                    <View style={styles.badgeRow}>
                        {passes.isCurrentlyOut ? (
                            <View style={[styles.badge, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                                <Ionicons name="walk" size={14} color="#f59e0b" />
                                <Text style={[styles.outBadgeText, { color: '#f59e0b' }]}>Currently Outside</Text>
                            </View>
                        ) : (
                            <View style={[styles.badge, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                                <Ionicons name="home" size={14} color={isDark ? '#86efac' : '#16a34a'} />
                                <Text style={[styles.inBadgeText, { color: isDark ? '#86efac' : '#16a34a' }]}>Inside Hostel</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="id-card" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll No</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.rollNo}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="bed" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Room</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.room}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="business" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hostel</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.hostel}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="call" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.phone}</Text>
                    </View>
                </View>

                {/* Attendance Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Attendance This Month</Text>
                        {!attendance.markedToday && (
                            <Pressable
                                style={[styles.markBtn, { backgroundColor: colors.primary }]}
                                onPress={handleMarkAttendance}
                                disabled={markAttendanceMutation.isPending}
                            >
                                <Ionicons name="add-circle" size={16} color="white" />
                                <Text style={styles.markBtnText}>Mark Today</Text>
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.attendanceStats}>
                        <View style={styles.attendanceStat}>
                            <Text style={[styles.attendanceNumber, { color: isDark ? '#86efac' : '#16a34a' }]}>{attendance.presentDays}</Text>
                            <Text style={[styles.attendanceLabel, { color: colors.textSecondary }]}>Present</Text>
                        </View>
                        <View style={styles.attendanceStat}>
                            <Text style={[styles.attendanceNumber, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                                {attendance.totalDays - attendance.presentDays}
                            </Text>
                            <Text style={[styles.attendanceLabel, { color: colors.textSecondary }]}>Absent</Text>
                        </View>
                        <View style={styles.attendanceStat}>
                            <Text style={[styles.attendanceNumber, { color: colors.primary }]}>
                                {attendance.monthlyPercentage}%
                            </Text>
                            <Text style={[styles.attendanceLabel, { color: colors.textSecondary }]}>Percentage</Text>
                        </View>
                    </View>

                    {/* Today's Status */}
                    <View style={[styles.todayStatus, attendance.markedToday ? (
                        isDark ? { backgroundColor: '#052e16' } : { backgroundColor: '#f0fdf4' }
                    ) : (
                        isDark ? { backgroundColor: '#451a03' } : { backgroundColor: '#fef2f2' }
                    )]}>
                        <Ionicons
                            name={attendance.markedToday ? 'checkmark-circle' : 'close-circle'}
                            size={20}
                            color={attendance.markedToday ? (isDark ? '#86efac' : '#16a34a') : (isDark ? '#fca5a5' : '#dc2626')}
                        />
                        <Text style={[
                            styles.todayStatusText,
                            { color: attendance.markedToday ? (isDark ? '#86efac' : '#16a34a') : (isDark ? '#fca5a5' : '#dc2626') }
                        ]}>
                            {attendance.markedToday ? 'Attendance marked today' : 'Not marked today'}
                        </Text>
                    </View>
                </View>

                {/* Gate Pass Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>🎫 Recent Gate Passes</Text>

                    {passes.activePass && (
                        <View style={[styles.activePass, {
                            backgroundColor: isDark ? '#052e16' : '#f0fdf4',
                            borderColor: isDark ? '#14532d' : '#86efac'
                        }]}>
                            <View style={styles.activePassHeader}>
                                <Ionicons name="shield-checkmark" size={20} color={isDark ? '#86efac' : '#16a34a'} />
                                <Text style={[styles.activePassTitle, { color: isDark ? '#86efac' : '#16a34a' }]}>Active Pass</Text>
                            </View>
                            <Text style={[styles.passReason, { color: colors.text }]}>{passes.activePass.reason}</Text>
                            <Text style={[styles.passDate, { color: isDark ? '#86efac' : '#16a34a' }]}>
                                {formatDate(passes.activePass.fromDate)} - {formatDate(passes.activePass.toDate)}
                            </Text>
                        </View>
                    )}

                    {passes.recent.length > 0 ? (
                        passes.recent.slice(0, 5).map((pass) => (
                            <View key={pass._id} style={[styles.passCard, { borderBottomColor: colors.cardBorder }]}>
                                <View style={styles.passInfo}>
                                    <Text style={[styles.passReason, { color: colors.text }]} numberOfLines={1}>
                                        {pass.reason}
                                    </Text>
                                    <Text style={[styles.passDate, { color: colors.textSecondary }]}>
                                        {formatDate(pass.fromDate)} - {formatDate(pass.toDate)}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    pass.status === 'APPROVED' ? { backgroundColor: isDark ? '#052e16' : '#f0fdf4' } :
                                        pass.status === 'REJECTED' ? { backgroundColor: isDark ? '#451a03' : '#fef2f2' } : { backgroundColor: isDark ? '#422006' : '#fef3c7' }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        pass.status === 'APPROVED' ? { color: isDark ? '#86efac' : '#16a34a' } :
                                            pass.status === 'REJECTED' ? { color: isDark ? '#fca5a5' : '#dc2626' } : { color: isDark ? '#fcd34d' : '#f59e0b' }
                                    ]}>
                                        {pass.status.replace('_', ' ')}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No gate passes found</Text>
                    )}
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

    // Profile Card
    profileCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: { fontSize: 32, fontWeight: '700', color: 'white' },
    studentName: { fontSize: 22, fontWeight: '700' },
    studentEmail: { fontSize: 14, marginTop: 4 },
    badgeRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    outBadgeText: { fontSize: 13, fontWeight: '600' },
    inBadgeText: { fontSize: 13, fontWeight: '600' },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    infoCard: {
        width: '48%',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    infoLabel: { fontSize: 12, marginTop: 6 },
    infoValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },

    // Section
    section: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600' },
    markBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    markBtnText: { fontSize: 13, fontWeight: '600', color: 'white' },

    // Attendance
    attendanceStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    attendanceStat: { alignItems: 'center' },
    attendanceNumber: { fontSize: 28, fontWeight: '700' },
    attendanceLabel: { fontSize: 12, marginTop: 2 },
    todayStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    todayStatusText: { fontSize: 14, fontWeight: '500' },

    // Passes
    activePass: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
    },
    activePassHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    activePassTitle: { fontSize: 14, fontWeight: '600' },
    passCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    passInfo: { flex: 1, marginRight: 12 },
    passReason: { fontSize: 14, fontWeight: '500' },
    passDate: { fontSize: 12, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: '600' },
    emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 16 },
});
