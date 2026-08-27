import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { Emergency } from '@/lib/types';

interface AlertCardProps {
    alert: Emergency;
    isAcknowledgePending: boolean;
    isResolvePending: boolean;
    onAcknowledge: (alert: Emergency) => void;
    onResolve: (alert: Emergency) => void;
}

export function AlertCard({
    alert,
    isAcknowledgePending,
    isResolvePending,
    onAcknowledge,
    onResolve,
}: AlertCardProps) {
    const { colors, isDark } = useTheme();

    const alertUser = typeof alert.user === 'object' && alert.user ? alert.user : null;
    const acknowledgedBy = typeof alert.acknowledgedBy === 'object' && alert.acknowledgedBy ? alert.acknowledgedBy : null;

    const typeColor = (type: string) => {
        switch (type) {
            case 'Medical': return { bg: isDark ? '#3f1118' : '#fef2f2', text: isDark ? '#fb7185' : '#dc2626', icon: 'medkit' as const };
            case 'Fire': return { bg: isDark ? '#451a03' : '#fef3c7', text: isDark ? '#fbbf24' : '#d97706', icon: 'flame' as const };
            case 'Ragging': return { bg: isDark ? '#2e1065' : '#ede9fe', text: isDark ? '#a78bfa' : '#7c3aed', icon: 'shield' as const };
            default: return { bg: isDark ? '#1c1917' : '#f5f5f4', text: isDark ? '#a3a3a3' : '#737373', icon: 'warning' as const };
        }
    };

    const getTimeAgo = (dateStr: string): string => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const style = typeColor(alert.type);
    const timeAgo = getTimeAgo(alert.createdAt);

    return (
        <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
            {/* Type badge + time */}
            <View style={styles.alertCardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: style.bg }]}>
                    <Ionicons name={style.icon} size={14} color={style.text} />
                    <Text style={[styles.typeBadgeText, { color: style.text }]}>{alert.type}</Text>
                </View>
                <Text style={[styles.alertTime, { color: colors.textSecondary }]}>{timeAgo}</Text>
            </View>

            {/* Student info */}
            <View style={styles.alertStudentRow}>
                <View style={[styles.avatarCircle, { backgroundColor: style.bg }]}>
                    <Ionicons name="person" size={20} color={style.text} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.studentName, { color: colors.text }]}>
                        {alertUser?.name || 'Unknown Student'}
                    </Text>
                    <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                        Room {alertUser?.room || 'N/A'} · {alertUser?.rollNo || 'N/A'}
                    </Text>
                    {alertUser?.phone ? (
                        <Pressable onPress={() => Linking.openURL(`tel:${alertUser.phone}`)}>
                            <Text style={[styles.studentPhone, { color: isDark ? '#60a5fa' : '#2563eb' }]}>
                                {alertUser.phone}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>

            {/* Message */}
            {alert.message ? (
                <View style={[styles.messageBox, { backgroundColor: isDark ? '#1c1917' : '#f5f5f4' }]}>
                    <Text style={[styles.messageText, { color: colors.textSecondary }]}>"{alert.message}"</Text>
                </View>
            ) : null}

            {/* Location */}
            {alert.location ? (
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={colors.textSecondary} />
                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>{alert.location}</Text>
                </View>
            ) : null}

            {/* Status row */}
            <View style={styles.statusRow}>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: alert.status === 'active'
                                ? (isDark ? '#450a0a' : '#fef2f2')
                                : (isDark ? '#052e16' : '#f0fdf4'),
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: alert.status === 'active' ? '#dc2626' : '#16a34a' },
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: alert.status === 'active'
                                    ? (isDark ? '#fca5a5' : '#dc2626')
                                    : (isDark ? '#86efac' : '#16a34a'),
                            },
                        ]}
                    >
                        {alert.status === 'active' ? 'Active' : 'Acknowledged'}
                    </Text>
                </View>
                {acknowledgedBy && (
                    <Text style={[styles.acknowledgedByText, { color: colors.textSecondary }]}>
                        by {acknowledgedBy.name}
                    </Text>
                )}
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
                {alert.status === 'active' && (
                    <Pressable
                        style={[styles.actionBtn, styles.acknowledgeBtn, { opacity: isAcknowledgePending ? 0.6 : 1 }]}
                        onPress={() => onAcknowledge(alert)}
                        disabled={isAcknowledgePending || isResolvePending}
                    >
                        <Ionicons name="eye" size={16} color="#1d4ed8" />
                        <Text style={styles.acknowledgeBtnText}>Acknowledge</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[styles.actionBtn, styles.resolveBtn, { opacity: isResolvePending ? 0.6 : 1 }]}
                    onPress={() => onResolve(alert)}
                    disabled={isResolvePending || isAcknowledgePending}
                >
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <Text style={styles.resolveBtnText}>Resolve</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    alertCard: { borderRadius: 18, padding: 16, gap: 10 },
    alertCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    typeBadgeText: { fontSize: 13, fontWeight: '600' },
    alertTime: { fontSize: 13 },
    alertStudentRow: { flexDirection: 'row', alignItems: 'center' },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    studentName: { fontSize: 15, fontWeight: '700' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    studentPhone: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    messageBox: { padding: 10, borderRadius: 10 },
    messageText: { fontSize: 14, fontStyle: 'italic' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 13 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 13, fontWeight: '600' },
    acknowledgedByText: { fontSize: 13 },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
    acknowledgeBtn: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
    acknowledgeBtnText: { color: '#1d4ed8', fontSize: 14, fontWeight: '600' },
    resolveBtn: { backgroundColor: '#16a34a' },
    resolveBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
