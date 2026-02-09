import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentChildren, useParentChildAttendance } from '@/lib/hooks';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/lib/theme-context';

export default function ParentAttendanceHistory() {
    const { colors, isDark } = useTheme();
    const { studentId } = useLocalSearchParams<{ studentId?: string }>();
    const [page, setPage] = useState(1);
    const [selectedChild, setSelectedChild] = useState<string | undefined>(studentId);

    const { data: children } = useParentChildren();

    const { data, isLoading, refetch, isRefetching } = useParentChildAttendance(
        selectedChild || '',
        page
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const attendance = data?.attendance || [];
    const pagination = data?.pagination;

    React.useEffect(() => {
        if (!selectedChild && children && children.length > 0) {
            setSelectedChild(children[0]._id);
        }
    }, [children, selectedChild]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="📊 Attendance History" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {/* Child Selector */}
                <View style={styles.childSelector}>
                    <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>Select Child</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.childTabs}>
                            {children?.map((child) => (
                                <Pressable
                                    key={child._id}
                                    style={[
                                        styles.childTab,
                                        { backgroundColor: colors.card },
                                        selectedChild === child._id && { backgroundColor: colors.primary }
                                    ]}
                                    onPress={() => {
                                        setSelectedChild(child._id);
                                        setPage(1);
                                    }}
                                >
                                    <Text style={[
                                        styles.childTabText,
                                        { color: colors.textSecondary },
                                        selectedChild === child._id && { color: 'white' }
                                    ]}>
                                        {child.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Today's Status */}
                {data?.todayAttendance && (
                    <View style={[styles.todayCard, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <View style={styles.todayIcon}>
                            <Ionicons name="checkmark-circle" size={32} color={isDark ? '#86efac' : '#16a34a'} />
                        </View>
                        <View style={styles.todayInfo}>
                            <Text style={[styles.todayLabel, { color: isDark ? '#86efac' : '#737373' }]}>Today's Attendance</Text>
                            <Text style={[styles.todayStatus, { color: isDark ? '#86efac' : '#16a34a' }]}>Present</Text>
                            <Text style={[styles.todayTime, { color: isDark ? '#bbf7d0' : '#525252' }]}>
                                Marked at {formatTime(data.todayAttendance.markedAt)}
                            </Text>
                        </View>
                    </View>
                )}

                {data && !data.todayMarked && (
                    <View style={[styles.todayCard, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                        <View style={styles.todayIcon}>
                            <Ionicons name="help-circle" size={32} color={isDark ? '#fbbf24' : '#f59e0b'} />
                        </View>
                        <View style={styles.todayInfo}>
                            <Text style={[styles.todayLabel, { color: isDark ? '#fcd34d' : '#737373' }]}>Today's Attendance</Text>
                            <Text style={[styles.todayStatus, { color: isDark ? '#fbbf24' : '#f59e0b' }]}>Not Marked Yet</Text>
                        </View>
                    </View>
                )}

                {/* History */}
                {!selectedChild ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Select a child to view attendance</Text>
                    </View>
                ) : isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                ) : attendance.length > 0 ? (
                    <>
                        <Text style={[styles.historyTitle, { color: colors.text }]}>Attendance History</Text>
                        {attendance.map((record: any) => (
                            <View key={record._id} style={[styles.attendanceRow, { backgroundColor: colors.card }]}>
                                <View style={[styles.attendanceIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                                    <Ionicons name="checkmark" size={16} color={isDark ? '#86efac' : '#16a34a'} />
                                </View>
                                <View style={styles.attendanceInfo}>
                                    <Text style={[styles.attendanceDate, { color: colors.text }]}>{formatDate(record.date)}</Text>
                                </View>
                                <Text style={[styles.attendanceTime, { color: colors.textSecondary }]}>{formatTime(record.markedAt)}</Text>
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No attendance records found</Text>
                    </View>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <View style={styles.pagination}>
                        <Pressable
                            style={[styles.pageBtn, { backgroundColor: colors.card }, page === 1 && styles.pageBtnDisabled]}
                            onPress={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <Ionicons name="chevron-back" size={20} color={page === 1 ? colors.textTertiary : colors.primary} />
                        </Pressable>
                        <Text style={[styles.pageInfo, { color: colors.textSecondary }]}>
                            Page {page} of {pagination.pages}
                        </Text>
                        <Pressable
                            style={[styles.pageBtn, { backgroundColor: colors.card }, page === pagination.pages && styles.pageBtnDisabled]}
                            onPress={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page === pagination.pages}
                        >
                            <Ionicons name="chevron-forward" size={20} color={page === pagination.pages ? colors.textTertiary : colors.primary} />
                        </Pressable>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    childSelector: { marginBottom: 20 },
    selectorLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    childTabs: { flexDirection: 'row', gap: 8 },
    childTab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    childTabText: { fontSize: 14, fontWeight: '500' },
    todayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 16,
    },
    todayIcon: {},
    todayInfo: {},
    todayLabel: { fontSize: 12 },
    todayStatus: { fontSize: 18, fontWeight: '700', marginTop: 2 },
    todayTime: { fontSize: 13, marginTop: 2 },
    historyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    attendanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },
    attendanceIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    attendanceInfo: { flex: 1 },
    attendanceDate: { fontSize: 14, fontWeight: '500' },
    attendanceTime: { fontSize: 13 },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 14, marginTop: 12 },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
    },
    pageBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageBtnDisabled: { opacity: 0.5 },
    pageInfo: { fontSize: 14 },
});
