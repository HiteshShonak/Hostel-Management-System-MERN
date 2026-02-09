import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useLaundry, useScheduleLaundry, useCollectLaundry, useRefreshDashboard } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { Badge } from '@/components/ui/Badge';

export default function LaundryPage() {
    const { colors, isDark } = useTheme();
    const { data: laundryData, isLoading } = useLaundry();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const scheduleMutation = useScheduleLaundry();
    const collectMutation = useCollectLaundry();

    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');

    const activeLaundry = laundryData?.find(l =>
        l.status !== 'Collected'
    );

    const handleSchedule = () => {
        if (!items || !scheduledDate) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        scheduleMutation.mutate(
            { items, scheduledDate },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setItems('');
                    setScheduledDate('');
                    Alert.alert('Success', 'Laundry scheduled successfully');
                },
            }
        );
    };

    const handleCollect = (id: string) => {
        Alert.alert(
            'Confirm Collection',
            'Have you collected your laundry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Collected',
                    onPress: () => collectMutation.mutate(id)
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'collected') return '#16a34a';
        if (s === 'ready') return '#1d4ed8';
        if (s === 'in progress') return '#f59e0b';
        return '#737373';
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Laundry" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Laundry" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Active Status Card */}
                    {activeLaundry ? (
                        <View style={[styles.statusCard, {
                            backgroundColor: isDark ? colors.card : '#eff6ff',
                            borderColor: isDark ? colors.cardBorder : '#dbeafe'
                        }]}>
                            <View style={styles.statusHeader}>
                                <Ionicons name="shirt" size={24} color={colors.primary} />
                                <Badge variant={activeLaundry.status === 'Ready' ? 'success' : 'warning'}>
                                    <Text style={{ color: 'white' }}>{activeLaundry.status}</Text>
                                </Badge>
                            </View>
                            <Text style={[styles.statusTitle, { color: isDark ? colors.text : '#1e3a8a' }]}>Your Laundry</Text>
                            <Text style={[styles.statusItems, { color: isDark ? colors.textSecondary : '#1e40af' }]}>{activeLaundry.items}</Text>
                            <Text style={[styles.statusDate, { color: colors.primary }]}>
                                Scheduled: {new Date(activeLaundry.scheduledDate).toLocaleDateString()}
                            </Text>

                            {/* Timeline */}
                            <View style={[styles.timeline, { borderTopColor: isDark ? colors.border : '#bfdbfe' }]}>
                                <View style={[styles.timelineStep, { opacity: 1 }]}>
                                    <View style={[styles.timelineDot, { backgroundColor: '#16a34a' }]} />
                                    <Text style={[styles.timelineText, { color: isDark ? colors.text : '#1e40af' }]}>Scheduled</Text>
                                </View>
                                <View style={[styles.timelineStep, { opacity: activeLaundry.status !== 'Scheduled' ? 1 : 0.4 }]}>
                                    <View style={[styles.timelineDot, { backgroundColor: activeLaundry.status === 'In Progress' || activeLaundry.status === 'Ready' ? '#16a34a' : '#d4d4d4' }]} />
                                    <Text style={[styles.timelineText, { color: isDark ? colors.text : '#1e40af' }]}>In Progress</Text>
                                </View>
                                <View style={[styles.timelineStep, { opacity: activeLaundry.status === 'Ready' ? 1 : 0.4 }]}>
                                    <View style={[styles.timelineDot, { backgroundColor: activeLaundry.status === 'Ready' ? '#16a34a' : '#d4d4d4' }]} />
                                    <Text style={[styles.timelineText, { color: isDark ? colors.text : '#1e40af' }]}>Ready</Text>
                                </View>
                            </View>

                            {activeLaundry.status === 'Ready' && (
                                <Pressable
                                    style={styles.collectBtn}
                                    onPress={() => handleCollect(activeLaundry._id)}
                                >
                                    <Ionicons name="checkmark-circle" size={20} color="white" />
                                    <Text style={styles.collectBtnText}>Mark as Collected</Text>
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                            <Ionicons name="shirt-outline" size={48} color={colors.primary} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Active Laundry</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Schedule a pickup for your clothes</Text>
                            <Pressable style={[styles.scheduleBtn, { backgroundColor: colors.primary }]} onPress={() => setShowModal(true)}>
                                <Ionicons name="add" size={20} color="white" />
                                <Text style={styles.scheduleBtnText}>Schedule Pickup</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Schedule Button (if active exists) */}
                    {activeLaundry && (
                        <Pressable style={[styles.newScheduleBtn, {
                            backgroundColor: isDark ? colors.card : '#eff6ff',
                            borderColor: isDark ? colors.cardBorder : '#dbeafe'
                        }]} onPress={() => setShowModal(true)}>
                            <Ionicons name="add-circle" size={20} color={colors.primary} />
                            <Text style={[styles.newScheduleBtnText, { color: colors.primary }]}>Schedule New</Text>
                        </Pressable>
                    )}

                    {/* History */}
                    {laundryData && laundryData.length > 0 && (
                        <View style={styles.historySection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>History</Text>
                            {laundryData.slice(0, 5).map((item) => (
                                <View key={item._id} style={[styles.historyItem, { borderBottomColor: colors.cardBorder }]}>
                                    <View style={styles.historyInfo}>
                                        <Text style={[styles.historyItems, { color: colors.text }]} numberOfLines={1}>{item.items}</Text>
                                        <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
                                            {new Date(item.scheduledDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Text style={[styles.historyStatus, { color: getStatusColor(item.status) }]}>
                                        {item.status}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Schedule Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Schedule Laundry</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </Pressable>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Items Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="e.g., 3 shirts, 2 pants, underwear"
                                placeholderTextColor={colors.textTertiary}
                                value={items}
                                onChangeText={setItems}
                                multiline
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Pickup Date</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={colors.textTertiary}
                                value={scheduledDate}
                                onChangeText={setScheduledDate}
                            />
                        </View>

                        <Pressable
                            style={[styles.submitBtn, { backgroundColor: colors.primary }, scheduleMutation.isPending && styles.btnDisabled]}
                            onPress={handleSchedule}
                            disabled={scheduleMutation.isPending}
                        >
                            {scheduleMutation.isPending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitBtnText}>Schedule Pickup</Text>
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
    content: { padding: 16, gap: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    statusCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
    statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    statusTitle: { fontSize: 18, fontWeight: '600' },
    statusItems: { fontSize: 14, marginTop: 4 },
    statusDate: { fontSize: 13, marginTop: 8 },
    timeline: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTopWidth: 1 },
    timelineStep: { alignItems: 'center', flex: 1 },
    timelineDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
    timelineText: { fontSize: 11 },
    collectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, marginTop: 16 },
    collectBtnText: { color: 'white', fontWeight: '600' },
    emptyCard: { alignItems: 'center', padding: 40, borderRadius: 20, borderWidth: 1 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 4 },
    scheduleBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, marginTop: 20 },
    scheduleBtnText: { color: 'white', fontWeight: '600' },
    newScheduleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1 },
    newScheduleBtnText: { fontWeight: '600' },
    historySection: { marginTop: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
    historyInfo: { flex: 1, marginRight: 12 },
    historyItems: { fontSize: 14, fontWeight: '500' },
    historyDate: { fontSize: 12, marginTop: 2 },
    historyStatus: { fontSize: 13, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    textArea: { height: 80, textAlignVertical: 'top' },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
