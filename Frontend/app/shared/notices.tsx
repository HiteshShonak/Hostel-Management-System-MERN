import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadMore } from '@/components/ui/LoadMore';
import { useTheme } from '@/lib/contexts/theme';
import {
    useNoticesController,
    NoticeCard,
    CreateNoticeModal,
    NoticeEmptyState,
} from '@/components/notices';

export default function NoticesPage() {
    const { colors } = useTheme();
    const {
        user,
        isWarden,
        canCreateNotice,
        allNotices,
        data,
        page,
        isLoading,
        isFetching,
        refreshing,
        handleRefresh,
        handleLoadMore,
        showModal,
        setShowModal,
        title,
        setTitle,
        description,
        setDescription,
        urgent,
        setUrgent,
        handleCreateNotice,
        createNoticeMutation,
        deleteNoticeMutation,
    } = useNoticesController();

    if (isLoading && page === 1) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Notices" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading notices...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Notices" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Staff: Create Notice Button */}
                    {canCreateNotice && (
                        <Pressable style={[styles.createBtn, { backgroundColor: colors.primary }]} onPress={() => setShowModal(true)}>
                            <Ionicons name="add-circle" size={20} color="white" />
                            <Text style={styles.createBtnText}>Issue New Notice</Text>
                        </Pressable>
                    )}

                    {/* Notices List */}
                    {allNotices && allNotices.length > 0 ? (
                        <View style={styles.list}>
                            {allNotices.map((notice) => (
                                <NoticeCard
                                    key={notice._id}
                                    notice={notice}
                                    user={user}
                                    canCreateNotice={canCreateNotice}
                                    onDelete={(id) => deleteNoticeMutation.mutate(id)}
                                />
                            ))}

                            {/* Load More Button */}
                            <LoadMore
                                onLoadMore={handleLoadMore}
                                isLoading={isFetching && page > 1}
                                hasMore={data?.pagination?.hasNext || false}
                                loadedCount={allNotices.length}
                                totalCount={data?.pagination?.total}
                            />
                        </View>
                    ) : (
                        <NoticeEmptyState isWarden={isWarden} />
                    )}
                </View>
            </ScrollView>

            {/* Create Notice Modal */}
            <CreateNoticeModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={title}
                onChangeTitle={setTitle}
                description={description}
                onChangeDescription={setDescription}
                urgent={urgent}
                onToggleUrgent={setUrgent}
                onSubmit={handleCreateNotice}
                isPending={createNoticeMutation.isPending}
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
    createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginBottom: 16 },
    createBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    list: { gap: 16 },
});
