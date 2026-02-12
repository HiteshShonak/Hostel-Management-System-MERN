import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Modal, TextInput, Platform, RefreshControl, Alert, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { LoadMore } from '@/components/ui/LoadMore';
import { useGatePasses, usePendingGatePasses, useRequestGatePass, useApproveGatePass, useRejectGatePass, useRefreshDashboard } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { formatDate } from '@/lib/utils/date';
import { GatePass, User } from '@/lib/types';
import { getErrorMessage, getErrorTitle } from '@/lib/error-utils';

export default function GatePassPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const isWarden = user?.role === 'warden' || user?.role === 'admin';

    // Pagination state for student view
    const [page, setPage] = useState(1);
    const [allPasses, setAllPasses] = useState<GatePass[]>([]);
    const LIMIT = 10;

    // Student hooks with pagination
    const { data: myData, isLoading: loadingMy, isFetching: fetchingMy } = useGatePasses(page, LIMIT);
    const requestMutation = useRequestGatePass();

    // Warden hooks (not paginated - usually smaller list of pending)
    const { data: pendingPasses, isLoading: loadingPending } = usePendingGatePasses();
    const approveMutation = useApproveGatePass();
    const rejectMutation = useRejectGatePass();

    // Accumulate passes when page changes (only for student view)
    useEffect(() => {
        if (!isWarden && myData?.data) {
            if (page === 1) {
                setAllPasses(myData.data);
            } else {
                setAllPasses(prev => [...prev, ...myData.data]);
            }
        }
    }, [myData, page, isWarden]);

    // Reset on refresh
    const handleRefresh = async () => {
        setPage(1);
        setAllPasses([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (myData?.pagination?.hasNext && !fetchingMy) {
            setPage(prev => prev + 1);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    // Picker states
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);
    const [activeField, setActiveField] = useState<'from' | 'to'>('from');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || (activeField === 'from' ? fromDate : toDate);
        setShow(Platform.OS === 'ios');

        if (activeField === 'from') {
            setFromDate(currentDate);
        } else {
            setToDate(currentDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time', field: 'from' | 'to') => {
        setShow(true);
        setMode(currentMode);
        setActiveField(field);
    };

    const handleRequest = () => {
        if (!reason || reason.length < 5) {
            alert('Reason must be at least 5 characters');
            return;
        }

        // Validate dates
        if (fromDate >= toDate) {
            alert('End time must be after start time');
            return;
        }

        if (fromDate < new Date()) {
            alert('Start time cannot be in the past');
            return;
        }

        requestMutation.mutate(
            { reason, fromDate: fromDate.toISOString(), toDate: toDate.toISOString() },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setReason('');
                    setFromDate(new Date());
                    setToDate(new Date());
                    setPage(1); // Reset to first page
                },
                onError: (error: unknown) => {
                    Alert.alert(
                        getErrorTitle(error),
                        getErrorMessage(error)
                    );
                },
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'destructive';
            case 'PENDING_PARENT':
            case 'PENDING_WARDEN':
            case 'PENDING':
                return 'warning';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING_PARENT': return 'Pending Parent';
            case 'PENDING_WARDEN': return 'Pending Warden';
            case 'APPROVED': return 'Approved';
            case 'REJECTED': return 'Rejected';
            default: return status;
        }
    };

    const getUserInfo = (passUser: string | User) => {
        if (typeof passUser === 'object') {
            return passUser;
        }
        return null;
    };

    const isLoading = isWarden ? loadingPending : (loadingMy && page === 1);
    const passes = isWarden ? pendingPasses : allPasses;

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Student: Apply Button (NOT for parents or warden) */}
                    {!isWarden && user?.role !== 'parent' && (
                        <Pressable style={[styles.applyBtn, { backgroundColor: colors.primary }]} onPress={() => setShowModal(true)}>
                            <Ionicons name="add-circle" size={20} color="white" />
                            <Text style={styles.applyBtnText}>Apply New Pass</Text>
                        </Pressable>
                    )}

                    {/* Warden: Scan QR Button */}
                    {isWarden && (
                        <Pressable
                            style={[styles.scanBtn, { backgroundColor: isDark ? '#14532d' : '#dcfce7', borderColor: colors.success }]}
                            onPress={() => router.push('/qr-scanner')}
                        >
                            <View style={[styles.scanBtnIcon, { backgroundColor: colors.card }]}>
                                <Ionicons name="scan" size={28} color={colors.success} />
                            </View>
                            <View style={styles.scanBtnContent}>
                                <Text style={[styles.scanBtnTitle, { color: colors.success }]}>Scan QR Code</Text>
                                <Text style={[styles.scanBtnSubtitle, { color: isDark ? '#4ade80' : '#15803d' }]}>Verify student gate passes</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={colors.success} />
                        </Pressable>
                    )}

                    {/* Passes List */}
                    {passes && passes.length > 0 ? (
                        <View style={styles.list}>
                            {passes.map((pass) => {
                                const passUser = getUserInfo(pass.user);
                                return (
                                    <View key={pass._id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                        <View style={styles.cardHeader}>
                                            <View>
                                                {isWarden && passUser && (
                                                    <Text style={[styles.userName, { color: colors.primary }]}>{passUser.name}</Text>
                                                )}
                                                <Text style={[styles.passReason, { color: colors.text }]}>{pass.reason}</Text>
                                                <Text style={[styles.passId, { color: colors.textTertiary }]}>#{pass._id.slice(-6).toUpperCase()}</Text>
                                            </View>
                                            <Badge variant={getStatusColor(pass.status) as any}>
                                                <Text style={{ color: 'white' }}>{getStatusLabel(pass.status)}</Text>
                                            </Badge>
                                        </View>

                                        {isWarden && passUser && (
                                            <View style={[styles.userInfo, { backgroundColor: colors.backgroundSecondary }]}>
                                                <Text style={[styles.userDetail, { color: colors.textSecondary }]}>🏠 Room: {passUser.room}</Text>
                                                <Text style={[styles.userDetail, { color: colors.textSecondary }]}>📞 {passUser.phone}</Text>
                                            </View>
                                        )}

                                        <View style={[styles.datesRow, { backgroundColor: colors.backgroundSecondary }]}>
                                            <View style={styles.dateBox}>
                                                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>FROM</Text>
                                                <Text style={[styles.dateValue, { color: colors.text }]}>{new Date(pass.fromDate).toLocaleDateString()}</Text>
                                                <Text style={[styles.timeValue, { color: colors.primary }]}>{new Date(pass.fromDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                            </View>
                                            <Ionicons name="arrow-forward" size={20} color={colors.textTertiary} />
                                            <View style={styles.dateBox}>
                                                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>TO</Text>
                                                <Text style={[styles.dateValue, { color: colors.text }]}>{new Date(pass.toDate).toLocaleDateString()}</Text>
                                                <Text style={[styles.timeValue, { color: colors.primary }]}>{new Date(pass.toDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                            </View>
                                        </View>

                                        {/* Show parent validation status for admin */}
                                        {user?.role === 'admin' && pass.status === 'PENDING_PARENT' && (
                                            <View style={[styles.parentValidationBox, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                                                <Ionicons name="alert-circle" size={16} color="#d97706" />
                                                <Text style={[styles.parentValidationText, { color: isDark ? '#fef3c7' : '#d97706' }]}>⏳ Awaiting Parent Approval</Text>
                                            </View>
                                        )}

                                        {/* Warden/Admin: Approve/Reject Buttons */}
                                        {isWarden && (pass.status === 'PENDING_WARDEN' || (user?.role === 'admin' && pass.status === 'PENDING_PARENT')) && (
                                            <View style={[styles.actionRow, { borderTopColor: colors.cardBorder }]}>
                                                <Pressable
                                                    style={[styles.actionBtn, styles.rejectBtn, { backgroundColor: colors.dangerLight, borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}
                                                    onPress={() => rejectMutation.mutate(pass._id)}
                                                    disabled={rejectMutation.isPending}
                                                >
                                                    <Ionicons name="close" size={20} color={colors.danger} />
                                                    <Text style={[styles.rejectText, { color: colors.danger }]}>Reject</Text>
                                                </Pressable>
                                                <Pressable
                                                    style={[styles.actionBtn, styles.approveBtn, { backgroundColor: colors.success }]}
                                                    onPress={() => approveMutation.mutate(pass._id)}
                                                    disabled={approveMutation.isPending}
                                                >
                                                    <Ionicons name="checkmark" size={20} color="white" />
                                                    <Text style={styles.approveText}>
                                                        {user?.role === 'admin' && pass.status === 'PENDING_PARENT' ? 'Approve (Bypass Parent)' : 'Approve'}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        )}

                                        {/* Student: Show QR if approved */}
                                        {!isWarden && pass.status === 'APPROVED' && pass.qrValue && (
                                            <View style={[styles.qrSection, { borderTopColor: colors.cardBorder }]}>
                                                <View style={[styles.qrContainer, { backgroundColor: isDark ? colors.card : 'white' }]}>
                                                    <QRCode
                                                        value={pass.qrValue}
                                                        size={180}
                                                        color={colors.primary}
                                                        backgroundColor={isDark ? colors.card : 'white'}
                                                    />
                                                </View>
                                                <Text style={[styles.qrCode, { color: colors.primary }]}>{pass.qrValue}</Text>
                                                <Text style={[styles.qrHint, { color: colors.textSecondary }]}>Show this QR at the gate for verification</Text>
                                                <View style={[styles.validityInfo, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
                                                    <Ionicons name="calendar" size={14} color={colors.success} />
                                                    <Text style={[styles.validityText, { color: isDark ? '#4ade80' : colors.success }]}>
                                                        Valid: {new Date(pass.fromDate).toLocaleDateString()} - {new Date(pass.toDate).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {/* Show Rejection Reason if Rejected */}
                                        {pass.status === 'REJECTED' && (pass.parentRejectionReason || pass.rejectionReason) && (
                                            <View style={[styles.rejectionBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
                                                <Ionicons name="alert-circle" size={16} color={isDark ? '#fca5a5' : '#dc2626'} />
                                                <Text style={[styles.rejectionText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                                                    Reason: {pass.parentRejectionReason || pass.rejectionReason}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}

                            {/* Load More Button - only for student view */}
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
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                                {isWarden ? 'No Pending Requests' : 'No Gate Passes'}
                            </Text>
                            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                {isWarden
                                    ? 'All gate pass requests have been processed'
                                    : 'Apply for a pass when you plan to leave'}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Apply Modal (Student only) */}
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
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Apply Gate Pass</Text>
                                    <Pressable onPress={() => setShowModal(false)}>
                                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                                    </Pressable>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.text }]}>Reason</Text>
                                    <TextInput
                                        style={[styles.input, { minHeight: 60, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                        placeholder="e.g., Going home for weekend"
                                        placeholderTextColor={colors.textTertiary}
                                        value={reason}
                                        onChangeText={setReason}
                                        multiline
                                    />
                                    <Text style={[styles.helperText, { color: colors.textSecondary }]}>Minimum 5 characters required</Text>
                                </View>

                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, { color: colors.text }]}>From</Text>
                                        <Pressable style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]} onPress={() => showMode('date', 'from')}>
                                            <Text style={{ color: colors.text }}>{fromDate.toLocaleDateString()}</Text>
                                        </Pressable>
                                        <Pressable style={[styles.input, { marginTop: 8, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]} onPress={() => showMode('time', 'from')}>
                                            <Text style={{ color: colors.text }}>{fromDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                        </Pressable>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={[styles.label, { color: colors.text }]}>To</Text>
                                        <Pressable style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]} onPress={() => showMode('date', 'to')}>
                                            <Text style={{ color: colors.text }}>{toDate.toLocaleDateString()}</Text>
                                        </Pressable>
                                        <Pressable style={[styles.input, { marginTop: 8, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]} onPress={() => showMode('time', 'to')}>
                                            <Text style={{ color: colors.text }}>{toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={activeField === 'from' ? fromDate : toDate}
                                        mode={mode}
                                        is24Hour={false}
                                        onChange={onChange}
                                    />
                                )}

                                <Pressable
                                    style={[styles.submitBtn, { backgroundColor: colors.primary }, requestMutation.isPending && styles.btnDisabled]}
                                    onPress={handleRequest}
                                    disabled={requestMutation.isPending}
                                >
                                    {requestMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.submitBtnText}>Submit Request</Text>
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
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#737373' },
    applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, marginBottom: 16 },
    applyBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    list: { gap: 16 },
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 16,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    userName: { fontSize: 16, fontWeight: '700', color: '#1d4ed8', marginBottom: 2 },
    passReason: { fontSize: 16, fontWeight: '600', color: '#0a0a0a' },
    passId: { fontSize: 12, color: '#a3a3a3', marginTop: 2 },
    userInfo: { flexDirection: 'row', gap: 16, marginBottom: 12, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8 },
    userDetail: { fontSize: 13, color: '#737373' },
    datesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 },
    dateBox: { alignItems: 'center' },
    dateLabel: { fontSize: 10, fontWeight: '600', color: '#737373', marginBottom: 2 },
    dateValue: { fontSize: 14, fontWeight: '600', color: '#0a0a0a' },
    timeValue: { fontSize: 12, fontWeight: '500', color: '#1d4ed8', marginTop: 2 },
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12 },
    rejectBtn: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
    approveBtn: { backgroundColor: '#16a34a' },
    rejectText: { color: '#dc2626', fontWeight: '600' },
    approveText: { color: 'white', fontWeight: '600' },
    qrSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f5f5f5', alignItems: 'center' },
    qrContainer: { padding: 20, backgroundColor: 'white', borderRadius: 16, marginBottom: 12 },
    qrCode: { fontSize: 14, fontWeight: '700', color: '#1d4ed8', letterSpacing: 2, marginTop: 8 },
    qrHint: { fontSize: 12, color: '#737373', marginTop: 4 },
    validityInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#dcfce7', borderRadius: 20 },
    validityText: { fontSize: 12, color: '#16a34a', fontWeight: '500' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', color: '#0a0a0a', marginTop: 16 },
    emptySubtext: { fontSize: 14, color: '#737373', marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '600', color: '#0a0a0a' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', color: '#0a0a0a', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
    row: { flexDirection: 'row' },
    submitBtn: { backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
    helperText: { fontSize: 12, color: '#737373', marginTop: 4 },
    parentValidationBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginTop: 12 },
    parentValidationText: { fontSize: 13, color: '#d97706', fontWeight: '500', flex: 1 },
    scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#dcfce7', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 2, borderColor: '#16a34a' },
    scanBtnIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
    scanBtnContent: { flex: 1 },
    scanBtnTitle: { fontSize: 18, fontWeight: '700', color: '#16a34a' },
    scanBtnSubtitle: { fontSize: 13, color: '#15803d', marginTop: 2 },
    rejectionBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1 },
    rejectionText: { fontSize: 13, fontWeight: '500', flex: 1 },
});
