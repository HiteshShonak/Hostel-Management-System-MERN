import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusPillBadge } from '@/components/ui/StatusPillBadge';
import { useTheme } from '@/lib/contexts/theme';
import { formatRelativeTime } from '@/lib/utils';
import type { Complaint, User } from '@/lib/types';

interface ComplaintCardProps {
    complaint: Complaint;
    isWarden: boolean;
    onResolve: (id: string) => void;
    isResolvePending: boolean;
}

export function ComplaintCard({
    complaint,
    isWarden,
    onResolve,
    isResolvePending,
}: ComplaintCardProps) {
    const { colors, isDark } = useTheme();
    const complaintUser = typeof complaint.user === 'object' && complaint.user ? (complaint.user as User) : null;

    const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
        switch (category) {
            case 'Plumbing': return 'water';
            case 'Electricity': return 'flash';
            case 'WiFi': return 'wifi';
            default: return 'help-circle';
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: isDark ? colors.background : '#f5f5f5' }]}>
                    <Ionicons name={getCategoryIcon(complaint.category)} size={18} color={colors.textSecondary} />
                </View>
                <StatusPillBadge status={complaint.status} />
            </View>

            {isWarden && complaintUser && (
                <View style={styles.userRow}>
                    <Text style={[styles.userName, { color: colors.primary }]}>{complaintUser.name}</Text>
                    <Text style={[styles.userRoom, { color: colors.textSecondary }]}>Room {complaintUser.room}</Text>
                </View>
            )}

            <Text style={[styles.complaintTitle, { color: colors.text }]}>{complaint.title}</Text>
            <Text style={[styles.complaintDesc, { color: colors.textSecondary }]}>{complaint.description}</Text>
            <Text style={[styles.complaintDate, { color: colors.textTertiary }]}>
                {formatRelativeTime(complaint.createdAt)}
            </Text>

            {/* Warden: Resolve Button */}
            {isWarden && complaint.status !== 'Resolved' && (
                <View style={[styles.actionRow, { borderTopColor: colors.cardBorder }]}>
                    <Pressable
                        style={styles.resolveBtn}
                        onPress={() => onResolve(complaint._id)}
                        disabled={isResolvePending}
                    >
                        <Ionicons name="checkmark-circle" size={18} color="white" />
                        <Text style={styles.resolveBtnText}>Mark Resolved</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: 16, borderWidth: 1, borderRadius: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    categoryIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    userName: { fontSize: 14, fontWeight: '600' },
    userRoom: { fontSize: 13 },
    complaintTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    complaintDesc: { fontSize: 14, lineHeight: 20 },
    complaintDate: { fontSize: 12, marginTop: 12 },
    actionRow: { marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', padding: 12, borderRadius: 12 },
    resolveBtnText: { color: 'white', fontWeight: '600' },
});
