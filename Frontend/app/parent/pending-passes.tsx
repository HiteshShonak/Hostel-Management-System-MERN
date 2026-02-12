import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentPendingPasses, useParentApprovePass, useParentRejectPass } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function ParentPendingPasses() {
    const { colors, isDark } = useTheme();
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const {
        data: passes,
        isLoading,
        refetch,
        isRefetching,
    } = useParentPendingPasses();

    const approveMutation = useParentApprovePass();
    const rejectMutation = useParentRejectPass();

    React.useEffect(() => {
        if (approveMutation.isSuccess) {
            Alert.alert('✅ Approved', 'Gate pass approved. Now waiting for warden approval.');
        }
    }, [approveMutation.isSuccess]);

    React.useEffect(() => {
        if (approveMutation.isError) {
            Alert.alert('Error', (approveMutation.error as any)?.message || 'Failed to approve pass');
        }
    }, [approveMutation.isError]);

    React.useEffect(() => {
        if (rejectMutation.isSuccess) {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedPassId(null);
            Alert.alert('❌ Rejected', 'Gate pass has been rejected.');
        }
    }, [rejectMutation.isSuccess]);

    React.useEffect(() => {
        if (rejectMutation.isError) {
            Alert.alert('Error', (rejectMutation.error as any)?.message || 'Failed to reject pass');
        }
    }, [rejectMutation.isError]);

    const handleApprove = (passId: string) => {
        Alert.alert(
            'Approve Gate Pass',
            'Are you sure you want to approve this gate pass?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => approveMutation.mutate(passId) },
            ]
        );
    };

    const handleReject = (passId: string) => {
        setSelectedPassId(passId);
        setRejectModalVisible(true);
    };

    const confirmReject = () => {
        if (selectedPassId) {
            rejectMutation.mutate({ passId: selectedPassId, reason: rejectReason });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

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
            <PageHeader title="🎫 Pending Approvals" showBack />

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
                        <View key={pass._id} style={[styles.passCard, { backgroundColor: colors.card }]}>
                            <View style={styles.passHeader}>
                                <View style={styles.studentInfo}>
                                    <View style={[styles.studentAvatar, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                                        <Ionicons name="person" size={24} color={isDark ? '#fbbf24' : '#b45309'} />
                                    </View>
                                    <View>
                                        <Text style={[styles.studentName, { color: colors.text }]}>{pass.student.name}</Text>
                                        <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                                            {pass.student.rollNo} • Room {pass.student.room}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.pendingBadge, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                                    <Text style={[styles.pendingText, { color: isDark ? '#fbbf24' : '#b45309' }]}>Pending</Text>
                                </View>
                            </View>

                            <View style={styles.passDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="document-text" size={18} color={colors.textSecondary} />
                                    <Text style={[styles.detailText, { color: colors.text }]}>{pass.reason}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar" size={18} color={colors.textSecondary} />
                                    <Text style={[styles.detailText, { color: colors.text }]}>
                                        {formatDate(pass.fromDate)} → {formatDate(pass.toDate)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <Pressable
                                    style={[styles.actionBtn, styles.rejectBtn, {
                                        backgroundColor: isDark ? '#450a0a' : '#fef2f2',
                                        borderColor: isDark ? '#7f1d1d' : '#fecaca'
                                    }]}
                                    onPress={() => handleReject(pass._id)}
                                    disabled={rejectMutation.isPending}
                                >
                                    <Ionicons name="close-circle" size={20} color={isDark ? '#fca5a5' : '#dc2626'} />
                                    <Text style={[styles.rejectBtnText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>Reject</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleApprove(pass._id)}
                                    disabled={approveMutation.isPending}
                                >
                                    <Ionicons name="checkmark-circle" size={20} color="white" />
                                    <Text style={styles.approveBtnText}>Approve</Text>
                                </Pressable>
                            </View>
                        </View>
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
            <Modal
                visible={rejectModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setRejectModalVisible(false)}
            >
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
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Reject Gate Pass</Text>
                                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                                    Please provide a reason (optional)
                                </Text>
                                <TextInput
                                    style={[styles.reasonInput, { backgroundColor: colors.background, color: colors.text }]}
                                    placeholder="Reason for rejection..."
                                    placeholderTextColor={colors.textTertiary}
                                    value={rejectReason}
                                    onChangeText={setRejectReason}
                                    multiline
                                    numberOfLines={3}
                                />
                                <View style={styles.modalButtons}>
                                    <Pressable
                                        style={[styles.cancelBtn, { backgroundColor: colors.background }]}
                                        onPress={() => {
                                            setRejectModalVisible(false);
                                            setRejectReason('');
                                        }}
                                    >
                                        <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.confirmRejectBtn}
                                        onPress={confirmReject}
                                        disabled={rejectMutation.isPending}
                                    >
                                        {rejectMutation.isPending ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text style={styles.confirmRejectText}>Reject</Text>
                                        )}
                                    </Pressable>
                                </View>
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    infoText: { flex: 1, fontSize: 14 },
    passCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    passHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    studentAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    pendingBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pendingText: { fontSize: 12, fontWeight: '600' },
    passDetails: { gap: 8, marginBottom: 16 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { fontSize: 14, flex: 1 },
    actionButtons: { flexDirection: 'row', gap: 12 },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    rejectBtn: { borderWidth: 1 },
    rejectBtnText: { fontSize: 15, fontWeight: '600' },
    approveBtn: { backgroundColor: '#16a34a' },
    approveBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
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
    emptyText: { fontSize: 14, textAlign: 'center' },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    modalSubtitle: { fontSize: 14, marginBottom: 16 },
    reasonInput: {
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 20,
    },
    modalButtons: { flexDirection: 'row', gap: 12 },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: { fontSize: 15, fontWeight: '600' },
    confirmRejectBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#dc2626',
        alignItems: 'center',
    },
    confirmRejectText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
