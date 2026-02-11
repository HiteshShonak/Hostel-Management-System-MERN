import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentTodayAttendance } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function ParentTodayAttendance() {
    const { colors, isDark } = useTheme();
    const {
        data: attendance,
        isLoading,
        refetch,
        isRefetching,
    } = useParentTodayAttendance();

    const formatTime = (dateString?: string) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Today's Attendance" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="📋 Today's Attendance" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {/* Date Banner */}
                <View style={[styles.dateBanner, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="calendar" size={24} color={colors.primary} />
                    <Text style={[styles.dateText, { color: colors.primary }]}>{currentDate}</Text>
                </View>

                {attendance && attendance.length > 0 ? (
                    attendance.map((item) => (
                        <View key={item.student._id} style={[styles.attendanceCard, { backgroundColor: colors.card }]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.studentInfo}>
                                    <View style={[
                                        styles.avatar,
                                        item.markedToday ?
                                            { backgroundColor: isDark ? '#052e16' : '#dcfce7' } :
                                            { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }
                                    ]}>
                                        <Text style={[
                                            styles.avatarText,
                                            item.markedToday ?
                                                { color: isDark ? '#86efac' : '#16a34a' } :
                                                { color: isDark ? '#fca5a5' : '#dc2626' }
                                        ]}>
                                            {item.student.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.studentName, { color: colors.text }]}>{item.student.name}</Text>
                                        <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                                            {item.student.rollNo} • {item.relationship}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.statusSection, { backgroundColor: isDark ? colors.background : '#f5f5f5' }]}>
                                <View style={styles.statusBadge}>
                                    <Ionicons
                                        name={item.markedToday ? "checkmark-circle" : "close-circle"}
                                        size={24}
                                        color={item.markedToday ? (isDark ? '#86efac' : '#16a34a') : (isDark ? '#fca5a5' : '#dc2626')}
                                    />
                                    <Text style={[
                                        styles.statusText,
                                        item.markedToday ?
                                            { color: isDark ? '#86efac' : '#16a34a' } :
                                            { color: isDark ? '#fca5a5' : '#dc2626' }
                                    ]}>
                                        {item.markedToday ? 'Present' : 'Not Marked'}
                                    </Text>
                                </View>

                                {item.markedToday && item.attendanceTime && (
                                    <View style={styles.timeInfo}>
                                        <Ionicons name="time" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                                            Marked at {formatTime(item.attendanceTime)}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.locationInfo}>
                                <Ionicons name="location" size={14} color={colors.textTertiary} />
                                <Text style={[styles.locationText, { color: colors.textTertiary }]}>
                                    Room {item.student.room}, {item.student.hostel}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                            <Ionicons name="people-outline" size={64} color={colors.primary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Children Linked</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Contact the hostel admin to link your child's account
                        </Text>
                    </View>
                )}

                {/* Legend */}
                <View style={[styles.legend, { backgroundColor: colors.card }]}>
                    <Text style={[styles.legendTitle, { color: colors.textSecondary }]}>Legend</Text>
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: isDark ? '#16a34a' : '#16a34a' }]} />
                            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Present - Attendance marked</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: isDark ? '#dc2626' : '#dc2626' }]} />
                            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Not marked yet</Text>
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
    dateBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    dateText: { fontSize: 16, fontWeight: '600' },
    attendanceCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 20, fontWeight: '700' },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    statusSection: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusText: { fontSize: 18, fontWeight: '700' },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    timeText: { fontSize: 13 },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: { fontSize: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
    legend: {
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    legendTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    legendRow: { gap: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendDot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 13 },
});
