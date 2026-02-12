import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotices } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function RecentNotices() {
    const { colors, isDark } = useTheme();
    const { data: noticesResponse, isLoading } = useNotices();
    const recentNotices = noticesResponse?.data?.slice(0, 3) || [];

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Recent Notices</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Recent Notices</Text>
                <Link href="/notices" asChild>
                    <Pressable style={styles.viewAllBtn}>
                        <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                    </Pressable>
                </Link>
            </View>
            <View style={styles.noticesList}>
                {recentNotices.length > 0 ? (
                    recentNotices.map((notice) => (
                        <View
                            key={notice._id}
                            style={[
                                styles.noticeCard,
                                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                                notice.urgent && {
                                    borderColor: isDark ? '#881337' : '#fecaca',
                                    backgroundColor: isDark ? '#4c0519' : '#fef2f2'
                                }
                            ]}
                        >
                            <View style={styles.noticeHeader}>
                                <Text
                                    style={[
                                        styles.noticeTitle,
                                        { color: colors.text },
                                        notice.urgent && { color: isDark ? '#fda4af' : '#991b1b' }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {notice.title}
                                </Text>
                                {notice.urgent && (
                                    <View style={[styles.urgentBadgeContainer, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]}>
                                        <Text style={styles.urgentBadgeText}>Urgent</Text>
                                    </View>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.noticeDesc,
                                    { color: colors.textSecondary },
                                    notice.urgent && { color: isDark ? '#fecdd3' : '#7f1d1d' }
                                ]}
                                numberOfLines={2}
                            >
                                {notice.description}
                            </Text>
                            <Text style={[styles.noticeDate, { color: colors.textTertiary }]}>
                                {formatRelativeTime(notice.createdAt)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <View style={[styles.emptyState, { backgroundColor: colors.backgroundSecondary }]}>
                        <Ionicons name="document-text-outline" size={32} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notices yet</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, paddingBottom: 24 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '600' },
    viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    viewAllText: { fontSize: 14, fontWeight: '500' },
    loadingContainer: { padding: 20, alignItems: 'center' },
    noticesList: { gap: 12 },
    noticeCard: { padding: 16, borderWidth: 1, borderRadius: 12 },
    noticeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    noticeTitle: { flex: 1, fontWeight: '500' },
    noticeDesc: { fontSize: 14, marginTop: 4 },
    noticeDate: { fontSize: 12, marginTop: 8 },
    urgentBadgeContainer: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    urgentBadgeText: { fontSize: 10, color: 'white', fontWeight: '600' },
    emptyState: { alignItems: 'center', padding: 24, borderRadius: 12 },
    emptyText: { fontSize: 14, marginTop: 8 },
});
