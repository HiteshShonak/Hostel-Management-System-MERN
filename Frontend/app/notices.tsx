import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Modal, TextInput, Switch, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { LoadMore } from '@/components/ui/LoadMore';
import { useNotices, useCreateNotice, useDeleteNotice, useRefreshDashboard } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { formatRelativeTime } from '@/lib/utils';
import type { Notice } from '@/lib/types';

export default function NoticesPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const createNoticeMutation = useCreateNotice();
    const deleteNoticeMutation = useDeleteNotice();

    // Pagination state
    const [page, setPage] = useState(1);
    const [allNotices, setAllNotices] = useState<Notice[]>([]);
    const LIMIT = 10;

    const { data, isLoading, isFetching } = useNotices(page, LIMIT);

    // Accumulate notices when page changes
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllNotices(data.data);
            } else {
                setAllNotices(prev => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    // Reset on refresh
    const handleRefresh = async () => {
        setPage(1);
        setAllNotices([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgent, setUrgent] = useState(false);

    const isWarden = user?.role === 'warden' || user?.role === 'admin';
    const isMessStaff = user?.role === 'mess_staff';
    const canCreateNotice = isWarden || isMessStaff;

    const handleCreateNotice = () => {
        if (!title || !description) return;

        if (title.length < 5) {
            alert('Title must be at least 5 characters long');
            return;
        }

        if (description.length < 10) {
            alert('Description must be at least 10 characters long');
            return;
        }

        createNoticeMutation.mutate(
            { title, description, urgent },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setTitle('');
                    setDescription('');
                    setUrgent(false);
                    setPage(1); // Reset to first page
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || 'Failed to create notice';
                    alert(message);
                }
            }
        );
    };

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
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
                                <View key={notice._id} style={[
                                    styles.card,
                                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                                    notice.urgent && {
                                        borderColor: isDark ? '#881337' : '#fecaca', // Rose-900 / Red-200
                                        backgroundColor: isDark ? '#4c0519' : '#fef2f2' // Rose-950 / Red-50
                                    }
                                ]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.badgeRow}>
                                            {notice.urgent && (
                                                <View style={[styles.urgentBadge, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]}>
                                                    <Ionicons name="alert" size={12} color="white" />
                                                    <Text style={styles.badgeText}>Urgent</Text>
                                                </View>
                                            )}
                                            {notice.source && (
                                                <View style={[
                                                    styles.sourceBadge,
                                                    notice.source === 'warden' && (isDark ? { backgroundColor: '#1e3a5f' } : styles.wardenBadge),
                                                    notice.source === 'mess_staff' && (isDark ? { backgroundColor: '#134e4a' } : styles.messBadge),
                                                    notice.source === 'system' && (isDark ? { backgroundColor: '#581c87' } : styles.systemBadge),
                                                ]}>
                                                    <Text style={[
                                                        styles.sourceBadgeText,
                                                        { color: isDark ? colors.text : '#374151' },
                                                        notice.source === 'warden' && isDark && { color: '#bfdbfe' },
                                                        notice.source === 'mess_staff' && isDark && { color: '#99f6e4' },
                                                        notice.source === 'system' && isDark && { color: '#e9d5ff' }
                                                    ]}>
                                                        {notice.source === 'warden' ? 'Warden' :
                                                            notice.source === 'mess_staff' ? 'Mess' : 'System'}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.date, { color: colors.textTertiary }]}>
                                            {formatRelativeTime(notice.createdAt)}
                                        </Text>
                                    </View>
                                    <Text style={[
                                        styles.noticeTitle,
                                        { color: colors.text },
                                        notice.urgent && { color: isDark ? '#fda4af' : '#991b1b' } // Soft Rose / Dark Red
                                    ]}>{notice.title}</Text>
                                    <Text style={[
                                        styles.noticeDesc,
                                        { color: colors.textSecondary },
                                        notice.urgent && { color: isDark ? '#fecdd3' : '#7f1d1d' }
                                    ]}>{notice.description}</Text>

                                    {/* Show delete button only for own notices */}
                                    {canCreateNotice && (
                                        typeof notice.createdBy === 'object'
                                            ? notice.createdBy._id === user?._id
                                            : notice.createdBy === user?._id
                                    ) && (
                                            <Pressable
                                                style={[styles.deleteBtn, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }]}
                                                onPress={() => deleteNoticeMutation.mutate(notice._id)}
                                            >
                                                <Ionicons name="trash-outline" size={16} color={isDark ? '#fb7185' : '#dc2626'} />
                                                <Text style={[styles.deleteBtnText, { color: isDark ? '#fb7185' : '#dc2626' }]}>Delete</Text>
                                            </Pressable>
                                        )}
                                </View>
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
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notices</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                {isWarden
                                    ? 'Issue a new notice to inform students'
                                    : 'There are no notices at the moment'}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Create Notice Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        >
                            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Issue Notice</Text>
                                    <Pressable onPress={() => setShowModal(false)}>
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </Pressable>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="Notice title"
                                        placeholderTextColor={colors.textTertiary}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Min 5 characters</Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="Notice details..."
                                        placeholderTextColor={colors.textTertiary}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={4}
                                    />
                                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Min 10 characters</Text>
                                </View>

                                <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: colors.text }]}>Mark as Urgent</Text>
                                    <Switch
                                        value={urgent}
                                        onValueChange={setUrgent}
                                        trackColor={{ false: colors.cardBorder, true: isDark ? '#be123c' : '#fecaca' }}
                                        thumbColor={urgent ? (isDark ? '#fb7185' : '#dc2626') : (isDark ? '#737373' : '#f4f4f4')}
                                    />
                                </View>

                                <Pressable
                                    style={[styles.submitBtn, { backgroundColor: colors.primary }, createNoticeMutation.isPending && styles.btnDisabled]}
                                    onPress={handleCreateNotice}
                                    disabled={createNoticeMutation.isPending}
                                >
                                    {createNoticeMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.submitBtnText}>Publish Notice</Text>
                                    )}
                                </Pressable>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

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
    createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, marginBottom: 16 },
    createBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    list: { gap: 16 },
    card: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: '600' },
    date: { fontSize: 12 },
    noticeTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    noticeDesc: { fontSize: 14, lineHeight: 22 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    deleteBtnText: { fontSize: 14 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    switchLabel: { fontSize: 16 },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
    // Source badge styles
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sourceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    wardenBadge: { backgroundColor: '#dbeafe' },
    messBadge: { backgroundColor: '#dcfce7' },
    systemBadge: { backgroundColor: '#f3e8ff' },
    sourceBadgeText: { fontSize: 10, fontWeight: '600' },
});
