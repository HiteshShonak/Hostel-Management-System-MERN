import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    usePendingPassesController,
    PendingPassCard,
    RejectPassModal,
} from '@/components/parent';

export default function ParentPendingPasses() {
    const { colors, isDark } = useTheme();
    const {
        passes,
        isLoading,
        refetch,
        isRefetching,
        rejectModalVisible,
        setRejectModalVisible,
        rejectReason,
        setRejectReason,
        approveMutation,
        rejectMutation,
        handleApprove,
        handleReject,
        confirmReject,
    } = usePendingPassesController();

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Pending Approvals" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading pending passes...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Pending Approvals" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {/* Info Banner */}
                <View style={[styles.infoBanner, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                    <Ionicons name="information-circle" size={24} color={isDark ? '#fbbf24' : '#b45309'} />
                    <Text style={[styles.infoText, { color: isDark ? '#fcd34d' : '#92400e' }]}>
                        Review and approve/reject gate pass requests from your children
                    </Text>
                </View>

                {passes && passes.length > 0 ? (
                    passes.map((pass) => (
                        <PendingPassCard
                            key={pass._id}
                            pass={pass}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isApprovePending={approveMutation.isPending}
                            isRejectPending={rejectMutation.isPending}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                            <Ionicons name="checkmark-done-circle" size={64} color={isDark ? '#86efac' : '#16a34a'} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No pending gate pass requests from your children
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Reject Modal */}
            <RejectPassModal
                visible={rejectModalVisible}
                reason={rejectReason}
                onChangeReason={setRejectReason}
                onClose={() => {
                    setRejectModalVisible(false);
                    setRejectReason('');
                }}
                onConfirm={confirmReject}
                isPending={rejectMutation.isPending}
            />

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    infoText: { flex: 1, fontSize: 14, fontWeight: '500' },
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
});
