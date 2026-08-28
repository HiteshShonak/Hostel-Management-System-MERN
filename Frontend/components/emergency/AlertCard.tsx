import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { Emergency } from '@/lib/types';
import { AlertActionButtons } from './AlertActionButtons';

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

            {/* Status and Action Buttons */}
            <AlertActionButtons
                alert={alert}
                isAcknowledgePending={isAcknowledgePending}
                isResolvePending={isResolvePending}
                onAcknowledge={onAcknowledge}
                onResolve={onResolve}
            />
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
});
