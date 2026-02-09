import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useWardenStudents, useWardenMarkAttendance } from '@/lib/hooks';
import { getErrorMessage } from '@/lib/error-utils';
import { useTheme } from '@/lib/theme-context';

export default function WardenStudentsScreen() {
    const { colors, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const { data, isLoading, refetch } = useWardenStudents(page, 20, debouncedSearch);
    const markAttendanceMutation = useWardenMarkAttendance();

    const students = data?.students || [];
    const pagination = data?.pagination;

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleMarkAttendance = (studentId: string, studentName: string) => {
        Alert.alert(
            'Mark Attendance',
            `Mark attendance for ${studentName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            await markAttendanceMutation.mutateAsync(studentId);
                            Alert.alert('Success', `Attendance marked for ${studentName}`);
                        } catch (error: unknown) {
                            Alert.alert('Error', getErrorMessage(error));
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Manage Students" showBack />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search by name, room, or roll no..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </Pressable>
                    ) : null}
                </View>
            </View>

            {/* Stats Summary */}
            {pagination && (
                <View style={styles.summaryBar}>
                    <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                        {pagination.total} students total
                    </Text>
                </View>
            )}

            {/* Students List */}
            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                    }
                >
                    {students.map((student) => (
                        <Pressable
                            key={student._id}
                            style={[styles.studentCard, { backgroundColor: colors.card }]}
                            onPress={() => router.push(`/warden/student-detail?id=${student._id}`)}
                        >
                            {/* Avatar & Info */}
                            <View style={styles.studentInfo}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.avatarText}>
                                        {student.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.studentDetails}>
                                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                                    <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                                        {student.rollNo} • Room {student.room}
                                    </Text>
                                </View>
                            </View>

                            {/* Status Badges */}
                            <View style={styles.statusContainer}>
                                {student.isOut && (
                                    <View style={[styles.badge, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                                        <Ionicons name="walk" size={12} color="#f59e0b" />
                                        <Text style={[styles.outBadgeText, { color: '#f59e0b' }]}>Out</Text>
                                    </View>
                                )}
                                {student.markedAttendanceToday ? (
                                    <View style={[styles.badge, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                                        <Ionicons name="checkmark" size={12} color={isDark ? '#86efac' : '#16a34a'} />
                                        <Text style={[styles.presentBadgeText, { color: isDark ? '#86efac' : '#16a34a' }]}>Present</Text>
                                    </View>
                                ) : (
                                    <Pressable
                                        style={[styles.badge, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}
                                        onPress={() => handleMarkAttendance(student._id, student.name)}
                                        disabled={markAttendanceMutation.isPending}
                                    >
                                        <Ionicons name="add-circle" size={12} color={colors.primary} />
                                        <Text style={[styles.markBadgeText, { color: colors.primary }]}>Mark</Text>
                                    </Pressable>
                                )}
                            </View>
                        </Pressable>
                    ))}

                    {students.length === 0 && !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students found</Text>
                        </View>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <View style={styles.paginationContainer}>
                            <Pressable
                                style={[styles.pageBtn, { backgroundColor: colors.card }, page === 1 && styles.pageBtnDisabled]}
                                onPress={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <Ionicons name="chevron-back" size={20} color={page === 1 ? colors.textTertiary : colors.primary} />
                            </Pressable>
                            <Text style={[styles.pageText, { color: colors.textSecondary }]}>
                                Page {page} of {pagination.pages}
                            </Text>
                            <Pressable
                                style={[styles.pageBtn, { backgroundColor: colors.card }, page === pagination.pages && styles.pageBtnDisabled]}
                                onPress={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                            >
                                <Ionicons name="chevron-forward" size={20} color={page === pagination.pages ? colors.textTertiary : colors.primary} />
                            </Pressable>
                        </View>
                    )}
                </ScrollView>
            )}

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: { padding: 16, paddingBottom: 8 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 10,
    },
    searchInput: { flex: 1, fontSize: 16 },
    summaryBar: { paddingHorizontal: 16, paddingBottom: 8 },
    summaryText: { fontSize: 14 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingTop: 8, paddingBottom: 100 },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { fontSize: 18, fontWeight: '600', color: 'white' },
    studentDetails: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    statusContainer: { flexDirection: 'row', gap: 6 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    outBadgeText: { fontSize: 11, fontWeight: '600' },
    presentBadgeText: { fontSize: 11, fontWeight: '600' },
    markBadgeText: { fontSize: 11, fontWeight: '600' },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, marginTop: 12 },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    pageBtn: { padding: 8, borderRadius: 8 },
    pageBtnDisabled: { opacity: 0.5 },
    pageText: { fontSize: 14 },
});
