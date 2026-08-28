import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    usePassHistoryController,
    WardenPassHistoryCard,
} from '@/components/warden';

export default function PassHistoryScreen() {
    const { colors } = useTheme();
    const {
        page,
        setPage,
        passes,
        pagination,
        isLoading,
        refreshing,
        onRefresh,
        formatDate,
        getStatusColor,
    } = usePassHistoryController();

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
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                    }
                >
                    {passes.map((pass) => (
                        <WardenPassHistoryCard
                            key={pass._id}
                            pass={pass}
                            statusColors={getStatusColor(pass.status)}
                            formatDate={formatDate}
                        />
                    ))}

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
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 14, marginTop: 8 },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
    },
    pageBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageBtnDisabled: { opacity: 0.5 },
    pageText: { fontSize: 14 },
});
