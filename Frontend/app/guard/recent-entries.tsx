import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useRecentEntries } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { PRIMARY_COLOR } from '@/lib/constants';
import { GatePass, User } from '@/lib/types';

export default function RecentEntriesScreen() {
    const { colors, isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useRecentEntries();

    const entries = data || [];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const getTimeDiff = (entryTime: string, exitTime: string) => {
        const diff = new Date(entryTime).getTime() - new Date(exitTime).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Recent Entries" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Recent Entries" showBack />

            {/* Summary */}
            <View style={[styles.summaryBar, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
                <View style={[styles.summaryIcon, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                    <Ionicons name="enter" size={20} color={colors.success} />
                </View>
                <Text style={[styles.summaryText, { color: colors.success }]}>{entries.length} entries today</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {entries.length > 0 ? (
                    entries.map((pass: GatePass & { isLate?: boolean, lateDuration?: string }) => {
                        const user = typeof pass.user === 'object' ? pass.user as User : null;
                        return (
                            <View key={pass._id} style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.success }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.avatar, { backgroundColor: colors.success }]}>
                                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={[styles.studentName, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                                        <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                                            {user?.rollNo || ''} • Room {user?.room || 'N/A'} • {user?.hostel || ''}
                                        </Text>
                                        <Text style={styles.phoneText}>📞 {user?.phone || 'N/A'}</Text>
                                    </View>

                                    {/* Duration or Late Badge */}
                                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                        <View style={[styles.durationBadge, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                                            <Text style={[styles.durationText, { color: isDark ? '#4ade80' : colors.success }]}>
                                                {pass.exitTime && pass.entryTime ? getTimeDiff(pass.entryTime, pass.exitTime) : '-'}
                                            </Text>
                                        </View>

                                        {/* Late Badge if applicable */}
                                        {pass.isLate && (
                                            <View style={[styles.durationBadge, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                                                <Text style={[styles.durationText, { color: '#ea580c' }]}>
                                                    LATE
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.detailsRow}>
                                    <View style={[styles.detailBox, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                                        <Ionicons name="exit-outline" size={16} color="#f59e0b" />
                                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exit</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>
                                            {pass.exitTime ? formatTime(pass.exitTime) : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={[styles.detailBox, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                                        <Ionicons name="enter-outline" size={16} color={colors.success} />
                                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Entry</Text>
                                        <Text style={[styles.detailValue, { color: colors.success }]}>
                                            {pass.entryTime ? formatTime(pass.entryTime) : 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.reasonRow, { borderTopColor: colors.cardBorder }]}>
                                    {pass.isLate ? (
                                        <>
                                            <Ionicons name="warning" size={14} color="#ea580c" />
                                            <Text style={[styles.reasonText, { color: '#ea580c' }]} numberOfLines={1}>
                                                Returned {pass.lateDuration || 'late'}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                                            <Text style={[styles.reasonText, { color: colors.success }]} numberOfLines={1}>
                                                Returned on time
                                            </Text>
                                        </>
                                    )}
                                    <Text style={[styles.dateText, { color: colors.textTertiary }]}>{pass.entryTime ? formatDate(pass.entryTime) : ''}</Text>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="log-in-outline" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Entries</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students have returned today</Text>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f0fdf4',
        borderBottomWidth: 1,
        borderBottomColor: '#bbf7d0',
    },
    summaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: { fontSize: 15, fontWeight: '600', color: '#166534' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    card: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#16a34a',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#16a34a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { fontSize: 18, fontWeight: '600', color: 'white' },
    cardInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600', color: '#0a0a0a' },
    studentMeta: { fontSize: 13, color: '#737373', marginTop: 2 },
    phoneText: { fontSize: 12, color: '#1d4ed8', marginTop: 4 },
    durationBadge: {
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    durationText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
    detailsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    detailBox: {
        flex: 1,
        backgroundColor: '#fff7ed',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    detailLabel: { fontSize: 11, color: '#737373', marginTop: 4 },
    detailValue: { fontSize: 16, fontWeight: '700', color: '#0a0a0a', marginTop: 2 },
    reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
    reasonText: { flex: 1, fontSize: 13, color: '#525252' },
    dateText: { fontSize: 12, color: '#a3a3a3' },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#0a0a0a', marginTop: 12 },
    emptyText: { fontSize: 14, color: '#a3a3a3', marginTop: 4 },
});
