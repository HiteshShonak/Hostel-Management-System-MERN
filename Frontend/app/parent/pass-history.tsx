import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    usePassHistoryController,
    PassHistoryCard,
} from '@/components/parent';

export default function ParentPassHistory() {
    const { colors, isDark } = useTheme();
    const {
        page,
        setPage,
        passes,
        pagination,
        isLoading,
        refetch,
        isRefetching,
        getStatusStyle,
    } = usePassHistoryController();

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
            <PageHeader title="Gate Pass History" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
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
                    passes.map((pass: any) => (
                        <PassHistoryCard
                            key={pass._id}
                            pass={pass}
                            statusStyle={getStatusStyle(pass.status)}
                        />
                    ))
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
                            onPress={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <Ionicons name="chevron-back" size={20} color={page === 1 ? colors.textTertiary : colors.primary} />
                        </Pressable>
                        <Text style={[styles.pageInfo, { color: colors.textSecondary }]}>
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

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    statsBar: { padding: 12, borderRadius: 8, marginBottom: 16 },
    statsText: { fontSize: 14, textAlign: 'center' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
    pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 },
    pageBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    pageBtnDisabled: { opacity: 0.5 },
    pageInfo: { fontSize: 14 },
});
