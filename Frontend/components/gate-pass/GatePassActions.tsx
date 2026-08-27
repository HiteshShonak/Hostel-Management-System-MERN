import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface GatePassActionsProps {
    passId: string;
    status: string;
    userRole?: string;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isApprovePending: boolean;
    isRejectPending: boolean;
}

export function GatePassActions({
    passId,
    status,
    userRole,
    onApprove,
    onReject,
    isApprovePending,
    isRejectPending,
}: GatePassActionsProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.actionRow, { borderTopColor: colors.cardBorder }]}>
            <Pressable
                style={[
                    styles.actionBtn,
                    styles.rejectBtn,
                    { backgroundColor: colors.dangerLight, borderColor: isDark ? '#7f1d1d' : '#fecaca' },
                ]}
                onPress={() => onReject(passId)}
                disabled={isRejectPending}
            >
                <Ionicons name="close" size={20} color={colors.danger} />
                <Text style={[styles.rejectText, { color: colors.danger }]}>Reject</Text>
            </Pressable>
            <Pressable
                style={[styles.actionBtn, styles.approveBtn, { backgroundColor: colors.success }]}
                onPress={() => onApprove(passId)}
                disabled={isApprovePending}
            >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.approveText}>
                    {userRole === 'admin' && status === 'PENDING_PARENT' ? 'Approve (Bypass Parent)' : 'Approve'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12 },
    rejectBtn: { borderWidth: 1 },
    approveBtn: {},
    rejectText: { fontWeight: '600' },
    approveText: { color: 'white', fontWeight: '600' },
});
