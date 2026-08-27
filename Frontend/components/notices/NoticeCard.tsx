import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { formatRelativeTime } from '@/lib/utils';
import type { Notice, User } from '@/lib/types';

interface NoticeCardProps {
    notice: Notice;
    user: User | null;
    canCreateNotice: boolean;
    onDelete: (id: string) => void;
}

export function NoticeCard({ notice, user, canCreateNotice, onDelete }: NoticeCardProps) {
    const { colors, isDark } = useTheme();

    const isAuthor =
        canCreateNotice &&
        (typeof notice.createdBy === 'object'
            ? notice.createdBy._id === user?._id
            : notice.createdBy === user?._id);

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                notice.urgent && {
                    borderColor: isDark ? '#881337' : '#fecaca',
                    backgroundColor: isDark ? '#4c0519' : '#fef2f2',
                },
            ]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                    {notice.urgent && (
                        <View style={[styles.urgentBadge, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]}>
                            <Ionicons name="alert" size={12} color="white" />
                            <Text style={styles.badgeText}>Urgent</Text>
                        </View>
                    )}
                    {notice.source && (
                        <View
                            style={[
                                styles.sourceBadge,
                                notice.source === 'warden' && (isDark ? { backgroundColor: '#1e3a5f' } : styles.wardenBadge),
                                notice.source === 'mess_staff' && (isDark ? { backgroundColor: '#134e4a' } : styles.messBadge),
                                notice.source === 'system' && (isDark ? { backgroundColor: '#581c87' } : styles.systemBadge),
                            ]}
                        >
                            <Text
                                style={[
                                    styles.sourceBadgeText,
                                    { color: isDark ? colors.text : '#374151' },
                                    notice.source === 'warden' && isDark && { color: '#bfdbfe' },
                                    notice.source === 'mess_staff' && isDark && { color: '#99f6e4' },
                                    notice.source === 'system' && isDark && { color: '#e9d5ff' },
                                ]}
                            >
                                {notice.source === 'warden' ? 'Warden' : notice.source === 'mess_staff' ? 'Mess' : 'System'}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.date, { color: colors.textTertiary }]}>
                    {formatRelativeTime(notice.createdAt)}
                </Text>
            </View>

            <Text
                style={[
                    styles.noticeTitle,
                    { color: colors.text },
                    notice.urgent && { color: isDark ? '#fda4af' : '#991b1b' },
                ]}
            >
                {notice.title}
            </Text>

            <Text
                style={[
                    styles.noticeDesc,
                    { color: colors.textSecondary },
                    notice.urgent && { color: isDark ? '#fecdd3' : '#7f1d1d' },
                ]}
            >
                {notice.description}
            </Text>

            {isAuthor && (
                <Pressable
                    style={[styles.deleteBtn, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }]}
                    onPress={() => onDelete(notice._id)}
                >
                    <Ionicons name="trash-outline" size={16} color={isDark ? '#fb7185' : '#dc2626'} />
                    <Text style={[styles.deleteBtnText, { color: isDark ? '#fb7185' : '#dc2626' }]}>Delete</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: 16, borderWidth: 1, borderRadius: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: '600' },
    sourceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    wardenBadge: { backgroundColor: '#dbeafe' },
    messBadge: { backgroundColor: '#dcfce7' },
    systemBadge: { backgroundColor: '#f3e8ff' },
    sourceBadgeText: { fontSize: 12, fontWeight: '600' },
    date: { fontSize: 12 },
    noticeTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    noticeDesc: { fontSize: 14, lineHeight: 22 },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    deleteBtnText: { fontSize: 14 },
});
