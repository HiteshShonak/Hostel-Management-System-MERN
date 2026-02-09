import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Modal, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { LoadMore } from '@/components/ui/LoadMore';
import { useComplaints, useAllComplaints, useCreateComplaint, useResolveComplaint, useRefreshDashboard } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { formatRelativeTime } from '@/lib/utils';
import { Complaint, User } from '@/lib/types';

const CATEGORIES = ['Plumbing', 'Electricity', 'WiFi', 'Other'] as const;

export default function ComplaintsPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const isWarden = user?.role === 'warden' || user?.role === 'admin';
    const { refreshing, onRefresh } = useRefreshDashboard();

    // Pagination state
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<Complaint[]>([]);
    const LIMIT = 10;

    const { data: myData, isLoading: loadingMy, isFetching: fetchingMy } = useComplaints(page, LIMIT);
    const { data: wardenData, isLoading: loadingAll, isFetching: fetchingAll } = useAllComplaints(page, isWarden ? 20 : 1);

    const createMutation = useCreateComplaint();
    const resolveMutation = useResolveComplaint();

    // Get the right data based on role
    const data = isWarden ? wardenData : myData;
    const isFetching = isWarden ? fetchingAll : fetchingMy;
    const isLoading = isWarden ? loadingAll : loadingMy;

    // Accumulate complaints when page changes
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllItems(data.data);
            } else {
                setAllItems(prev => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    // Reset on refresh
    const handleRefresh = async () => {
        setPage(1);
        setAllItems([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState<typeof CATEGORIES[number]>('Other');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!title || title.length < 5) {
            alert('Title must be at least 5 characters');
            return;
        }
        if (!description || description.length < 10) {
            alert('Description must be at least 10 characters');
            return;
        }
        createMutation.mutate(
            { category, title, description },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setTitle('');
                    setDescription('');
                    setCategory('Other');
                    setPage(1); // Reset to first page
                },
            }
        );
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'In Progress': return 'warning';
            default: return 'secondary';
        }
    };

    const getUserInfo = (complaintUser: string | User) => {
        if (typeof complaintUser === 'object') return complaintUser;
        return null;
    };

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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
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
                        <View style={styles.statsRow}>
                            <View style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                                <Text style={[styles.statNum, { color: isDark ? '#fca5a5' : '#0a0a0a' }]}>{allItems.filter((c: Complaint) => c.status === 'Pending').length}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                                <Text style={[styles.statNum, { color: isDark ? '#fcd34d' : '#0a0a0a' }]}>{allItems.filter((c: Complaint) => c.status === 'In Progress').length}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                                <Text style={[styles.statNum, { color: isDark ? '#86efac' : '#0a0a0a' }]}>{allItems.filter((c: Complaint) => c.status === 'Resolved').length}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
                            </View>
                        </View>
                    )}

                    {/* Complaints List */}
                    {allItems && allItems.length > 0 ? (
                        <View style={styles.list}>
                            {allItems.map((complaint: Complaint) => {
                                const complaintUser = getUserInfo(complaint.user);
                                return (
                                    <View key={complaint._id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                        <View style={styles.cardHeader}>
                                            <View style={[styles.categoryIcon, { backgroundColor: isDark ? colors.background : '#f5f5f5' }]}>
                                                <Ionicons
                                                    name={
                                                        complaint.category === 'Plumbing' ? 'water' :
                                                            complaint.category === 'Electricity' ? 'flash' :
                                                                complaint.category === 'WiFi' ? 'wifi' : 'help-circle'
                                                    }
                                                    size={18}
                                                    color={colors.textSecondary}
                                                />
                                            </View>
                                            <Badge variant={getStatusVariant(complaint.status) as any}>
                                                <Text style={{ color: 'white', fontSize: 11 }}>{complaint.status}</Text>
                                            </Badge>
                                        </View>

                                        {isWarden && complaintUser && (
                                            <View style={styles.userRow}>
                                                <Text style={[styles.userName, { color: colors.primary }]}>{complaintUser.name}</Text>
                                                <Text style={[styles.userRoom, { color: colors.textSecondary }]}>Room {complaintUser.room}</Text>
                                            </View>
                                        )}

                                        <Text style={[styles.complaintTitle, { color: colors.text }]}>{complaint.title}</Text>
                                        <Text style={[styles.complaintDesc, { color: colors.textSecondary }]}>{complaint.description}</Text>
                                        <Text style={[styles.complaintDate, { color: colors.textTertiary }]}>
                                            {formatRelativeTime(complaint.createdAt)}
                                        </Text>

                                        {/* Warden: Resolve Button */}
                                        {isWarden && complaint.status !== 'Resolved' && (
                                            <View style={[styles.actionRow, { borderTopColor: colors.cardBorder }]}>
                                                <Pressable
                                                    style={styles.resolveBtn}
                                                    onPress={() => resolveMutation.mutate(complaint._id)}
                                                    disabled={resolveMutation.isPending}
                                                >
                                                    <Ionicons name="checkmark-circle" size={18} color="white" />
                                                    <Text style={styles.resolveBtnText}>Mark Resolved</Text>
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}

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
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbox-ellipses-outline" size={64} color={colors.textTertiary} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Complaints</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                {isWarden ? 'No complaints to review' : 'Lodge a complaint if you face any issues'}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Lodge Complaint Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Lodge Complaint</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </Pressable>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                            <View style={styles.categoryRow}>
                                {CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat}
                                        style={[
                                            styles.categoryBtn,
                                            { backgroundColor: category === cat ? colors.primary : (isDark ? colors.background : '#f5f5f5') }
                                        ]}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text style={[
                                            styles.categoryText,
                                            { color: category === cat ? 'white' : colors.textSecondary }
                                        ]}>
                                            {cat}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Brief title"
                                placeholderTextColor={colors.textTertiary}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Describe the issue in detail..."
                                placeholderTextColor={colors.textTertiary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <Pressable
                            style={[styles.submitBtn, { backgroundColor: '#f59e0b' }, createMutation.isPending && styles.btnDisabled]}
                            onPress={handleSubmit}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Complaint</Text>
                            )}
                        </Pressable>
                    </View>
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
    lodgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginBottom: 16 },
    lodgeBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    statNum: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4 },
    list: { gap: 16 },
    card: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 16,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    categoryIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    userName: { fontSize: 14, fontWeight: '600' },
    userRoom: { fontSize: 12 },
    complaintTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    complaintDesc: { fontSize: 14, lineHeight: 20 },
    complaintDate: { fontSize: 12, marginTop: 12 },
    actionRow: { marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', padding: 12, borderRadius: 12 },
    resolveBtnText: { color: 'white', fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 },
    categoryText: { fontSize: 14 },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
