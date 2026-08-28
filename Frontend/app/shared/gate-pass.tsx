import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadMore } from '@/components/ui/LoadMore';
import { useTheme } from '@/lib/contexts/theme';
import {
    useGatePassController,
    GatePassHeaderActions,
    GatePassCard,
    GatePassEmptyState,
    ApplyGatePassModal,
} from '@/components/gate-pass';

export default function GatePassPage() {
    const { colors } = useTheme();
    const {
        user,
        isWarden,
        isLoading,
        passes,
        refreshing,
        handleRefresh,
        handleLoadMore,
        fetchingMy,
        page,
        myData,
        allPasses,
        approveMutation,
        rejectMutation,
        requestMutation,
        showModal,
        setShowModal,
        reason,
        setReason,
        fromDate,
        toDate,
        mode,
        showPicker,
        activeField,
        onChangePicker,
        showMode,
        handleRequest,
    } = useGatePassController();

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Gate Pass" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading passes...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title={isWarden ? 'Gate Pass Approvals' : 'Gate Pass'} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Header Action: Apply (Student) or Scan QR (Warden) */}
                    <GatePassHeaderActions
                        user={user}
                        isWarden={isWarden}
                        onApplyPress={() => setShowModal(true)}
                    />

                    {/* Passes List or Empty State */}
                    {passes && passes.length > 0 ? (
                        <View style={styles.list}>
                            {passes.map((pass) => (
                                <GatePassCard
                                    key={pass._id}
                                    pass={pass}
                                    isWarden={isWarden}
                                    userRole={user?.role}
                                    onApprove={(id) => approveMutation.mutate(id)}
                                    onReject={(id) => rejectMutation.mutate(id)}
                                    isApprovePending={approveMutation.isPending}
                                    isRejectPending={rejectMutation.isPending}
                                />
                            ))}

                            {/* Student: Load More Pagination */}
                            {!isWarden && (
                                <LoadMore
                                    onLoadMore={handleLoadMore}
                                    isLoading={fetchingMy && page > 1}
                                    hasMore={myData?.pagination?.hasNext || false}
                                    loadedCount={allPasses.length}
                                    totalCount={myData?.pagination?.total}
                                />
                            )}
                        </View>
                    ) : (
                        <GatePassEmptyState isWarden={isWarden} />
                    )}
                </View>
            </ScrollView>

            {/* Apply Gate Pass Modal */}
            <ApplyGatePassModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                reason={reason}
                onChangeReason={setReason}
                fromDate={fromDate}
                toDate={toDate}
                showPicker={showPicker}
                mode={mode}
                activeField={activeField}
                onShowPicker={showMode}
                onChangePicker={onChangePicker}
                onSubmit={handleRequest}
                isPending={requestMutation.isPending}
            />

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    list: { gap: 16 },
});
