import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusPillBadge } from '@/components/ui/StatusPillBadge';
import { useTheme } from '@/lib/contexts/theme';
import type { GatePass, User } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';
import { GatePassQRSection } from './GatePassQRSection';
import { GatePassActions } from './GatePassActions';

interface GatePassCardProps {
    pass: GatePass;
    isWarden: boolean;
    userRole?: string;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isApprovePending: boolean;
    isRejectPending: boolean;
}

export function GatePassCard({
    pass,
    isWarden,
    userRole,
    onApprove,
    onReject,
    isApprovePending,
    isRejectPending,
}: GatePassCardProps) {
    const { colors, isDark } = useTheme();
    const passUser = typeof pass.user === 'object' && pass.user ? (pass.user as User) : null;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View>
                    {isWarden && passUser && (
                        <Text style={[styles.userName, { color: colors.primary }]}>{passUser.name}</Text>
                    )}
                    <Text style={[styles.passReason, { color: colors.text }]}>{pass.reason}</Text>
                    <Text style={[styles.passId, { color: colors.textTertiary }]}>#{pass._id.slice(-6).toUpperCase()}</Text>
                </View>
                <StatusPillBadge status={pass.status} />
            </View>

            {/* Warden View: Student Info */}
            {isWarden && passUser && (
                <View style={[styles.userInfo, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.userDetail, { color: colors.textSecondary }]}>Room: {passUser.room}</Text>
                    <Text style={[styles.userDetail, { color: colors.textSecondary }]}>{passUser.phone}</Text>
                </View>
            )}

            {/* Dates & Times */}
            <View style={[styles.datesRow, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.dateBox}>
                    <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>FROM</Text>
                    <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(pass.fromDate)}</Text>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>
                        {formatTime(pass.fromDate)}
                    </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={colors.textTertiary} />
                <View style={styles.dateBox}>
                    <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>TO</Text>
                    <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(pass.toDate)}</Text>
                    <Text style={[styles.timeValue, { color: colors.primary }]}>
                        {formatTime(pass.toDate)}
                    </Text>
                </View>
            </View>

            {/* Admin View: Awaiting Parent Approval Badge */}
            {userRole === 'admin' && pass.status === 'PENDING_PARENT' && (
                <View style={[styles.parentValidationBox, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                    <Ionicons name="alert-circle" size={16} color="#d97706" />
                    <Text style={[styles.parentValidationText, { color: isDark ? '#fef3c7' : '#d97706' }]}>
                        Awaiting Parent Approval
                    </Text>
                </View>
            )}

            {/* Warden / Admin Actions */}
            {isWarden && (pass.status === 'PENDING_WARDEN' || (userRole === 'admin' && pass.status === 'PENDING_PARENT')) && (
                <GatePassActions
                    passId={pass._id}
                    status={pass.status}
                    userRole={userRole}
                    onApprove={onApprove}
                    onReject={onReject}
                    isApprovePending={isApprovePending}
                    isRejectPending={isRejectPending}
                />
            )}

            {/* Student: Show QR Code if Approved */}
            {!isWarden && pass.status === 'APPROVED' && pass.qrValue && (
                <GatePassQRSection
                    qrValue={pass.qrValue}
                    fromDate={pass.fromDate}
                    toDate={pass.toDate}
                />
            )}

            {/* Rejection Reason Box */}
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
}

const styles = StyleSheet.create({
    card: { padding: 16, borderWidth: 1, borderRadius: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    userName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    passReason: { fontSize: 16, fontWeight: '600' },
    passId: { fontSize: 12, marginTop: 2 },
    userInfo: { flexDirection: 'row', gap: 16, marginBottom: 12, padding: 12, borderRadius: 8 },
    userDetail: { fontSize: 14 },
    datesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8 },
    dateBox: { alignItems: 'center' },
    dateLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
    dateValue: { fontSize: 14, fontWeight: '600' },
    timeValue: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    parentValidationBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, marginTop: 12 },
    parentValidationText: { fontSize: 14, fontWeight: '500', flex: 1 },
    rejectionBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1 },
    rejectionText: { fontSize: 14, fontWeight: '500', flex: 1 },
});
