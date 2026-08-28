import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusPillBadge } from '@/components/ui/StatusPillBadge';
import { useTheme } from '@/lib/contexts/theme';
import type { PendingGatePass } from '@/lib/services';

interface PendingPassCardProps {
    pass: PendingGatePass;
    onApprove: (passId: string) => void;
    onReject: (passId: string) => void;
    isApprovePending: boolean;
    isRejectPending: boolean;
}

export function PendingPassCard({
    pass,
    onApprove,
    onReject,
    isApprovePending,
    isRejectPending,
}: PendingPassCardProps) {
    const { colors, isDark } = useTheme();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <View style={[styles.passCard, { backgroundColor: colors.card }]}>
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
                <StatusPillBadge status="PENDING" label="Pending" />
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
                    style={[
                        styles.actionBtn,
                        styles.rejectBtn,
                        {
                            backgroundColor: isDark ? '#450a0a' : '#fef2f2',
                            borderColor: isDark ? '#7f1d1d' : '#fecaca',
                        },
                    ]}
                    onPress={() => onReject(pass._id)}
                    disabled={isRejectPending}
                >
                    <Ionicons name="close-circle" size={20} color={isDark ? '#fca5a5' : '#dc2626'} />
                    <Text style={[styles.rejectBtnText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>Reject</Text>
                </Pressable>
                <Pressable
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => onApprove(pass._id)}
                    disabled={isApprovePending}
                >
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.approveBtnText}>Approve</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    passCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    studentAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    studentName: { fontSize: 15, fontWeight: '600' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    pendingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    pendingText: { fontSize: 12, fontWeight: '600' },
    passDetails: { gap: 8, marginBottom: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    detailText: { fontSize: 14, flex: 1 },
    actionButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6 },
    rejectBtn: { borderWidth: 1 },
    rejectBtnText: { fontSize: 14, fontWeight: '600' },
    approveBtn: { backgroundColor: '#16a34a' },
    approveBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
