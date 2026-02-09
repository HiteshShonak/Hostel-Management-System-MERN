import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useQuery } from '@tanstack/react-query';
import { gatePassService } from '@/lib/services';
import { GatePass, User } from '@/lib/types';
import { useTheme } from '@/lib/theme-context';

export default function PassHistoryScreen() {
    const { colors, isDark } = useTheme();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    // Use warden-specific endpoint that shows ALL passes
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['warden-all-passes', page],
        queryFn: () => gatePassService.getAllPassesHistory(page, 20),
    });

    const passes = data?.data || [];
    const pagination = data?.pagination;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return { bg: isDark ? '#052e16' : '#f0fdf4', text: isDark ? '#86efac' : '#16a34a' };
            case 'REJECTED': return { bg: isDark ? '#451a03' : '#fef2f2', text: isDark ? '#fca5a5' : '#dc2626' };
            default: return { bg: isDark ? '#422006' : '#fef3c7', text: isDark ? '#fcd34d' : '#f59e0b' };
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Pass History" showBack />

            {/* Summary */}
            {pagination && (
                <View style={styles.summaryBar}>
                    <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                        {pagination.total} total passes
                    </Text>
                </View>
            )}

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
                    {passes.map((pass: GatePass) => {
                        const user = typeof pass.user === 'object' ? pass.user as User : null;
                        const statusColors = getStatusColor(pass.status);

                        return (
                            <View key={pass._id} style={[styles.passCard, { backgroundColor: colors.card }]}>
                                <View style={styles.passHeader}>
                                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.avatarText}>
                                            {user?.name?.charAt(0) || '?'}
                                        </Text>
                                    </View>
                                    <View style={styles.passInfo}>
                                        <Text style={[styles.studentName, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                                        <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                                            {user?.rollNo || ''} • Room {user?.room || 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                                            {pass.status.replace('_', ' ')}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.passDetails, { borderTopColor: colors.cardBorder }]}>
                                    <Text style={[styles.passReason, { color: colors.textSecondary }]} numberOfLines={2}>{pass.reason}</Text>
                                    <View style={styles.dateRow}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                                            {formatDate(pass.fromDate)} - {formatDate(pass.toDate)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                    {passes.length === 0 && !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No passes found</Text>
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
    summaryBar: { paddingHorizontal: 16, paddingVertical: 8 },
    summaryText: { fontSize: 14 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    passCard: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    passHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { fontSize: 16, fontWeight: '600', color: 'white' },
    passInfo: { flex: 1 },
    studentName: { fontSize: 15, fontWeight: '600' },
    studentMeta: { fontSize: 12, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '600' },
    passDetails: {
        paddingTop: 12,
        borderTopWidth: 1,
    },
    passReason: { fontSize: 14, marginBottom: 8 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { fontSize: 13 },
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
