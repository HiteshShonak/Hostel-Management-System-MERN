import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentAllPasses } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { GatePass } from '@/lib/types';

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
    PENDING_PARENT: { bg: '#fef3c7', text: '#b45309', icon: 'time' },
    PENDING_WARDEN: { bg: '#eff6ff', text: '#1d4ed8', icon: 'hourglass' },
    APPROVED: { bg: '#dcfce7', text: '#16a34a', icon: 'checkmark-circle' },
    REJECTED: { bg: '#fef2f2', text: '#dc2626', icon: 'close-circle' },
};

export default function ParentPassHistory() {
    const { colors, isDark } = useTheme();
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch, isRefetching } = useParentAllPasses(page);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
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

    const passes = data?.passes || [];
    const pagination = data?.pagination;

    // Helper for status styles in dark mode
    const getStatusStyle = (status: string) => {
        const base = STATUS_STYLES[status] || STATUS_STYLES.PENDING_PARENT;
        if (!isDark) return base;

        // Dark mode overrides
        switch (status) {
            case 'PENDING_PARENT': return { bg: '#422006', text: '#fcd34d', icon: base.icon };
            case 'PENDING_WARDEN': return { bg: '#172554', text: '#60a5fa', icon: base.icon };
            case 'APPROVED': return { bg: '#052e16', text: '#86efac', icon: base.icon };
            case 'REJECTED': return { bg: '#450a0a', text: '#fca5a5', icon: base.icon };
            default: return { bg: '#422006', text: '#fcd34d', icon: base.icon };
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Gate Pass History" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="📋 Gate Pass History" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {/* Stats Summary */}
                {pagination && (
                    <View style={[styles.statsBar, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                        <Text style={[styles.statsText, { color: isDark ? '#fcd34d' : '#92400e' }]}>
                            Showing {passes.length} of {pagination.total} passes
                        </Text>
                    </View>
                )}

                {passes.length > 0 ? (
                    passes.map((pass: any) => {
                        const statusStyle = getStatusStyle(pass.status);
                        return (
                            <View key={pass._id} style={[styles.passCard, { backgroundColor: colors.card }]}>
                                <View style={styles.passHeader}>
                                    <View style={styles.studentInfo}>
                                        <View style={[styles.studentAvatar, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                                            <Text style={[styles.avatarText, { color: isDark ? '#fbbf24' : '#b45309' }]}>
                                                {pass.student.name.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.studentName, { color: colors.text }]}>{pass.student.name}</Text>
                                            <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                                                {pass.student.rollNo} • Room {pass.student.room}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Ionicons name={statusStyle.icon as any} size={14} color={statusStyle.text} />
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                            {pass.status.replace('_', ' ')}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.passDetails}>
                                    <View style={styles.detailRow}>
                                        <Ionicons name="document-text" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={2}>{pass.reason}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                                            {formatDate(pass.fromDate)} → {formatDate(pass.toDate)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.passFooter, { borderTopColor: colors.border }]}>
                                    <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                                        Applied: {formatDate(pass.createdAt)} at {formatTime(pass.createdAt)}
                                    </Text>
                                    {pass.parentApprovedAt && (
                                        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                                            • Approved by you: {formatDate(pass.parentApprovedAt)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                            <Ionicons name="document-text-outline" size={64} color={isDark ? '#fbbf24' : '#b45309'} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Gate Passes</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Gate pass history for your children will appear here
                        </Text>
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    statsBar: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    statsText: { fontSize: 13, textAlign: 'center' },
    passCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    passHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    studentAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 18, fontWeight: '700' },
    studentName: { fontSize: 15, fontWeight: '600' },
    studentDetails: { fontSize: 12, marginTop: 2 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    passDetails: { gap: 8, marginBottom: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    detailText: { fontSize: 13, flex: 1 },
    passFooter: {
        paddingTop: 12,
        borderTopWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    footerText: { fontSize: 11 },
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
