import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/Badge';
import { useVisitors, useRegisterVisitor } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function VisitorsPage() {
    const { colors, isDark } = useTheme();
    const { data: visitors, isLoading } = useVisitors();
    const registerMutation = useRegisterVisitor();

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [phone, setPhone] = useState('');
    const [purpose, setPurpose] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [expectedTime, setExpectedTime] = useState('');

    const handleRegister = () => {
        if (!name || !relation || !phone || !expectedDate || !expectedTime) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        registerMutation.mutate(
            { name, relation, phone, purpose, expectedDate, expectedTime },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setName('');
                    setRelation('');
                    setPhone('');
                    setPurpose('');
                    setExpectedDate('');
                    setExpectedTime('');
                    Alert.alert('Success', 'Visitor registered successfully');
                },
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Checked-In': return 'success';
            case 'Expected': return 'warning';
            case 'Visited': return 'secondary';
            default: return 'secondary';
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Visitors" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Visitors" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Register Button */}
                    <Pressable style={styles.registerBtn} onPress={() => setShowModal(true)}>
                        <Ionicons name="person-add" size={20} color="white" />
                        <Text style={styles.registerBtnText}>Register Visitor</Text>
                    </Pressable>

                    {/* Visitors List */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Registered Visitors</Text>
                    <View style={styles.list}>
                        {visitors && visitors.length > 0 ? (
                            visitors.map((visitor) => (
                                <View key={visitor._id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.visitorInfo}>
                                            <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? 'rgba(20, 184, 166, 0.2)' : '#ccfbf1' }]}>
                                                <Text style={[styles.avatarText, { color: '#14b8a6' }]}>{visitor.name.charAt(0)}</Text>
                                            </View>
                                            <View style={styles.visitorDetails}>
                                                <Text style={[styles.visitorName, { color: colors.text }]}>{visitor.name}</Text>
                                                <Text style={[styles.relation, { color: colors.textSecondary }]}>{visitor.relation}</Text>
                                            </View>
                                        </View>
                                        <Badge variant={getStatusColor(visitor.status) as any}>
                                            <Text style={{ color: 'white', fontSize: 11 }}>{visitor.status}</Text>
                                        </Badge>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{visitor.phone}</Text>
                                        </View>
                                        {visitor.purpose && (
                                            <View style={styles.infoItem}>
                                                <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>{visitor.purpose}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={[styles.timeRow, { backgroundColor: isDark ? colors.background : '#f0fdfa' }]}>
                                        <View style={styles.timeBlock}>
                                            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                                            <Text style={[styles.timeText, { color: colors.primary }]}>
                                                {new Date(visitor.expectedDate).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View style={styles.timeBlock}>
                                            <Ionicons name="time-outline" size={14} color={colors.primary} />
                                            <Text style={[styles.timeText, { color: colors.primary }]}>{visitor.expectedTime}</Text>
                                        </View>
                                    </View>

                                    {visitor.checkInTime && (
                                        <View style={[styles.checkTimes, { borderTopColor: colors.cardBorder }]}>
                                            <Text style={[styles.checkText, { color: colors.textSecondary }]}>
                                                Checked in: {new Date(visitor.checkInTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                            </Text>
                                            {visitor.checkOutTime && (
                                                <Text style={[styles.checkText, { color: colors.textSecondary }]}>
                                                    Checked out: {new Date(visitor.checkOutTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Visitors</Text>
                                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Register expected visitors to streamline their entry</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Register Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Register Visitor</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </Pressable>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="Visitor name"
                                    placeholderTextColor={colors.textTertiary}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                <Text style={[styles.label, { color: colors.text }]}>Relation *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="e.g., Parent"
                                    placeholderTextColor={colors.textTertiary}
                                    value={relation}
                                    onChangeText={setRelation}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Phone *</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="+91 98765 43210"
                                placeholderTextColor={colors.textTertiary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Purpose</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="e.g., Family visit"
                                placeholderTextColor={colors.textTertiary}
                                value={purpose}
                                onChangeText={setPurpose}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.text }]}>Expected Date *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={colors.textTertiary}
                                    value={expectedDate}
                                    onChangeText={setExpectedDate}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                <Text style={[styles.label, { color: colors.text }]}>Expected Time *</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="10:00 AM"
                                    placeholderTextColor={colors.textTertiary}
                                    value={expectedTime}
                                    onChangeText={setExpectedTime}
                                />
                            </View>
                        </View>

                        <Pressable
                            style={[styles.submitBtn, registerMutation.isPending && styles.btnDisabled]}
                            onPress={handleRegister}
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitBtnText}>Register Visitor</Text>
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
    registerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#14b8a6', padding: 16, borderRadius: 12, marginBottom: 20 },
    registerBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    list: { gap: 16 },
    card: { padding: 16, borderWidth: 1, borderRadius: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    visitorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    visitorDetails: { flex: 1 },
    avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 18, fontWeight: '700' },
    visitorName: { fontSize: 16, fontWeight: '600' },
    relation: { fontSize: 13, marginTop: 2 },
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { fontSize: 13 },
    timeRow: { flexDirection: 'row', gap: 16, padding: 12, borderRadius: 8 },
    timeBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    timeText: { fontSize: 13, fontWeight: '500' },
    checkTimes: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    checkText: { fontSize: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 14 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row' },
    submitBtn: { backgroundColor: '#14b8a6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
