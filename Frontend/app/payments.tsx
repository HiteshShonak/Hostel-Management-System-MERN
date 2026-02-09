import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { usePayments, usePayPayment } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function PaymentsPage() {
    const { colors, isDark } = useTheme();
    const { data: payments, isLoading } = usePayments();
    const payMutation = usePayPayment();

    const [selectedTab, setSelectedTab] = useState<'pending' | 'paid'>('pending');

    const pendingPayments = payments?.filter(p => p.status === 'Pending') || [];
    const paidPayments = payments?.filter(p => p.status === 'Paid') || [];
    const totalDue = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

    const handlePay = (id: string, title: string, amount: number) => {
        Alert.alert(
            'Confirm Payment',
            `Pay ₹${amount.toLocaleString()} for ${title}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => {
                        payMutation.mutate(id, {
                            onSuccess: () => {
                                Alert.alert('Success', 'Payment marked as paid');
                            },
                        });
                    },
                },
            ]
        );
    };

    const getPaymentIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mess': return 'restaurant';
            case 'hostel': return 'bed';
            case 'laundry': return 'shirt';
            case 'electricity': return 'flash';
            default: return 'card';
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Payments" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Payments" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Due Card */}
                    <View style={[styles.dueCard, { backgroundColor: colors.primary }]}>
                        <View style={styles.dueIconContainer}>
                            <Ionicons name="wallet" size={28} color="white" />
                        </View>
                        <Text style={styles.dueLabel}>Total Due</Text>
                        <Text style={styles.dueAmount}>₹{totalDue.toLocaleString()}</Text>
                        {totalDue > 0 && (
                            <Text style={styles.dueCount}>{pendingPayments.length} pending payment(s)</Text>
                        )}
                    </View>

                    {/* Tabs */}
                    <View style={[styles.tabs, { backgroundColor: isDark ? colors.card : '#f5f5f5' }]}>
                        <Pressable
                            style={[
                                styles.tab,
                                selectedTab === 'pending' && styles.tabActive,
                                selectedTab === 'pending' && isDark && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => setSelectedTab('pending')}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedTab === 'pending' && styles.tabTextActive,
                                selectedTab === 'pending' && isDark && { color: 'white' },
                                !isDark && { color: selectedTab === 'pending' ? '#0a0a0a' : '#737373' },
                                isDark && selectedTab !== 'pending' && { color: colors.textSecondary }
                            ]}>
                                Pending ({pendingPayments.length})
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.tab,
                                selectedTab === 'paid' && styles.tabActive,
                                selectedTab === 'paid' && isDark && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => setSelectedTab('paid')}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedTab === 'paid' && styles.tabTextActive,
                                selectedTab === 'paid' && isDark && { color: 'white' },
                                !isDark && { color: selectedTab === 'paid' ? '#0a0a0a' : '#737373' },
                                isDark && selectedTab !== 'paid' && { color: colors.textSecondary }
                            ]}>
                                Paid ({paidPayments.length})
                            </Text>
                        </Pressable>
                    </View>

                    {/* Payment List */}
                    <View style={styles.list}>
                        {(selectedTab === 'pending' ? pendingPayments : paidPayments).length > 0 ? (
                            (selectedTab === 'pending' ? pendingPayments : paidPayments).map((payment) => (
                                <View key={payment._id} style={[styles.paymentCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                    <View style={styles.paymentHeader}>
                                        <View style={styles.paymentInfo}>
                                            <View style={[
                                                styles.paymentIcon,
                                                { backgroundColor: selectedTab === 'pending' ? (isDark ? '#450a0a' : '#fef2f2') : (isDark ? '#052e16' : '#dcfce7') }
                                            ]}>
                                                <Ionicons
                                                    name={getPaymentIcon(payment.type)}
                                                    size={20}
                                                    color={selectedTab === 'pending' ? '#dc2626' : '#16a34a'}
                                                />
                                            </View>
                                            <View>
                                                <Text style={[styles.paymentTitle, { color: colors.text }]}>{payment.title}</Text>
                                                <Text style={[styles.paymentType, { color: colors.textSecondary }]}>{payment.type}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.paymentRight}>
                                            <Text style={[styles.paymentAmount, { color: colors.text }]}>₹{payment.amount.toLocaleString()}</Text>
                                            <Badge variant={payment.status === 'Paid' ? 'success' : 'destructive'}>
                                                <Text style={{ color: 'white', fontSize: 11 }}>{payment.status}</Text>
                                            </Badge>
                                        </View>
                                    </View>

                                    <View style={[styles.paymentDetails, { borderTopColor: colors.cardBorder }]}>
                                        <View style={styles.detailItem}>
                                            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                                            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                                                {payment.status === 'Paid' && payment.paidAt
                                                    ? `Paid: ${new Date(payment.paidAt).toLocaleDateString()}`
                                                    : `Due: ${new Date(payment.dueDate).toLocaleDateString()}`
                                                }
                                            </Text>
                                        </View>
                                    </View>

                                    {selectedTab === 'pending' && (
                                        <Pressable
                                            style={styles.payBtn}
                                            onPress={() => handlePay(payment._id, payment.title, payment.amount)}
                                            disabled={payMutation.isPending}
                                        >
                                            <Ionicons name="card" size={18} color="white" />
                                            <Text style={styles.payBtnText}>Pay Now</Text>
                                        </Pressable>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name={selectedTab === 'pending' ? 'checkmark-circle-outline' : 'receipt-outline'}
                                    size={64}
                                    color={colors.textTertiary}
                                />
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                                    {selectedTab === 'pending' ? 'No Pending Dues' : 'No Payment History'}
                                </Text>
                                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                    {selectedTab === 'pending'
                                        ? "You're all caught up!"
                                        : 'Your payment history will appear here'
                                    }
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
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
    dueCard: { alignItems: 'center', padding: 28, borderRadius: 24, marginBottom: 20 },
    dueIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    dueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    dueAmount: { color: 'white', fontSize: 40, fontWeight: '700', marginTop: 4 },
    dueCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 },
    tabs: { flexDirection: 'row', padding: 4, borderRadius: 12, marginBottom: 16 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
    tabActive: { backgroundColor: 'white' },
    tabText: { fontSize: 14, fontWeight: '500' },
    tabTextActive: { fontWeight: '600' },
    list: { gap: 16 },
    paymentCard: { padding: 16, borderWidth: 1, borderRadius: 16 },
    paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    paymentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    paymentIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    paymentTitle: { fontSize: 16, fontWeight: '600' },
    paymentType: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
    paymentRight: { alignItems: 'flex-end', gap: 4 },
    paymentAmount: { fontSize: 18, fontWeight: '700' },
    paymentDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 13 },
    payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, marginTop: 12 },
    payBtnText: { color: 'white', fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});
