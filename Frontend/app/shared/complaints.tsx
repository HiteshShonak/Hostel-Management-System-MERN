import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadMore } from '@/components/ui/LoadMore';
import { useTheme } from '@/lib/contexts/theme';
import {
    useComplaintsController,
    ComplaintStatsBar,
    ComplaintCard,
    LodgeComplaintModal,
    ComplaintEmptyState,
} from '@/components/complaints';

export default function ComplaintsPage() {
    const { colors } = useTheme();
    const {
        isWarden,
        allItems,
        data,
        page,
        isLoading,
        isFetching,
        refreshing,
        handleRefresh,
        handleLoadMore,
        showModal,
        setShowModal,
        category,
        setCategory,
        title,
        setTitle,
        description,
        setDescription,
        handleSubmit,
        createMutation,
        resolveMutation,
    } = useComplaintsController();

    if (isLoading && page === 1) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Complaints" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title={isWarden ? 'All Complaints' : 'My Complaints'} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Student: Lodge Button */}
                    {!isWarden && (
                        <Pressable style={[styles.lodgeBtn, { backgroundColor: '#f59e0b' }]} onPress={() => setShowModal(true)}>
                            <Ionicons name="add-circle" size={20} color="white" />
                            <Text style={styles.lodgeBtnText}>Lodge Complaint</Text>
                        </Pressable>
                    )}

                    {/* Stats for Warden */}
                    {isWarden && allItems && allItems.length > 0 && (
                        <ComplaintStatsBar complaints={allItems} />
                    )}

                    {/* Complaints List */}
                    {allItems && allItems.length > 0 ? (
                        <View style={styles.list}>
                            {allItems.map((complaint) => (
                                <ComplaintCard
                                    key={complaint._id}
                                    complaint={complaint}
                                    isWarden={isWarden}
                                    onResolve={(id) => resolveMutation.mutate(id)}
                                    isResolvePending={resolveMutation.isPending}
                                />
                            ))}

                            {/* Load More Button */}
                            <LoadMore
                                onLoadMore={handleLoadMore}
                                isLoading={isFetching && page > 1}
                                hasMore={data?.pagination?.hasNext || false}
                                loadedCount={allItems.length}
                                totalCount={data?.pagination?.total}
                            />
                        </View>
                    ) : (
                        <ComplaintEmptyState isWarden={isWarden} />
                    )}
                </View>
            </ScrollView>

            {/* Lodge Complaint Modal */}
            <LodgeComplaintModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                category={category}
                onChangeCategory={setCategory}
                title={title}
                onChangeTitle={setTitle}
                description={description}
                onChangeDescription={setDescription}
                onSubmit={handleSubmit}
                isPending={createMutation.isPending}
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
    lodgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginBottom: 16 },
    lodgeBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    list: { gap: 16 },
});
