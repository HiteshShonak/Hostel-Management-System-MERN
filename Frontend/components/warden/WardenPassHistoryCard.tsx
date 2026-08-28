import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusPillBadge } from '@/components/ui/StatusPillBadge';
import { useTheme } from '@/lib/contexts/theme';
import { GatePass, User } from '@/lib/types';
import { StatusStyle } from './usePassHistoryController';

interface WardenPassHistoryCardProps {
    pass: GatePass;
    statusColors: StatusStyle;
    formatDate: (dateStr: string) => string;
}

export function WardenPassHistoryCard({ pass, statusColors, formatDate }: WardenPassHistoryCardProps) {
    const { colors } = useTheme();
    const user = typeof pass.user === 'object' ? (pass.user as User) : null;

    return (
        <View style={[styles.passCard, { backgroundColor: colors.card }]}>
            <View style={styles.passHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0) || '?'}
                    </Text>
                </View>
                <View style={styles.passInfo}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                    <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                        {user?.rollNo || ''} • Room {user?.room || 'N/A'}
                    </Text>
                </View>
                <StatusPillBadge
                    status={pass.status}
                    bg={statusColors.bg}
                    color={statusColors.text}
                />
            </View>

            <View style={[styles.passDetails, { borderTopColor: colors.cardBorder }]}>
                <Text style={[styles.passReason, { color: colors.textSecondary }]} numberOfLines={2}>
                    {pass.reason}
                </Text>
                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                        {formatDate(pass.fromDate)} - {formatDate(pass.toDate)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    passCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    passHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    passInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: { fontSize: 12, fontWeight: '600' },
    passDetails: {
        paddingTop: 12,
        borderTopWidth: 1,
    },
    passReason: { fontSize: 14, marginBottom: 8 },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: { fontSize: 13 },
});
