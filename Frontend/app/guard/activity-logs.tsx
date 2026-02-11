import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useActivityLogs } from '@/lib/hooks';
import { PRIMARY_COLOR } from '@/lib/constants';
import { nowIST } from '@/lib/utils/date';

interface LogEntry {
    _id: string;
    action: 'EXIT' | 'ENTRY';
    timestamp: string;
    isLate?: boolean;
    note?: string;
    user: { name: string; rollNo: string; room: string; hostel: string; phone: string };
    gatePass: { reason: string; qrValue: string };
    markedBy: { name: string; role: string };
}

import { useTheme } from '@/lib/theme-context';

export default function ActivityLogsScreen() {
    const { colors, isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useActivityLogs(1, 100);

    const logs = data?.logs || [];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeAgo = (dateStr: string) => {
        const now = nowIST();
        const date = new Date(dateStr);
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.container}>
                <PageHeader title="Activity Logs" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    <Text style={styles.loadingText}>Loading logs...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    // Count today's exits and entries
    const exitCount = logs.filter((l: LogEntry) => l.action === 'EXIT').length;
    const entryCount = logs.filter((l: LogEntry) => l.action === 'ENTRY').length;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Activity Logs" showBack />

            {/* Stats Bar */}
            <View style={[styles.statsBar, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
                <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#fff7ed' }]}>
                        <Ionicons name="exit-outline" size={18} color="#f59e0b" />
                    </View>
                    <View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{exitCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exits</Text>
                    </View>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#f0fdf4' }]}>
                        <Ionicons name="enter-outline" size={18} color="#16a34a" />
                    </View>
                    <View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{entryCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Entries</Text>
                    </View>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}>
                        <Ionicons name="list" size={18} color="#1d4ed8" />
                    </View>
                    <View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{logs.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
                }
            >
                <Text style={styles.sectionTitle}>Today's Activity</Text>

                {logs.length > 0 ? (
                    <View style={styles.timeline}>
                        {logs.map((log: LogEntry, index: number) => {
                            const isExit = log.action === 'EXIT';
                            const isLast = index === logs.length - 1;

                            return (
                                <View key={log._id} style={styles.logItem}>
                                    {/* Timeline line */}
                                    {!isLast && <View style={styles.timelineLine} />}

                                    {/* Timeline dot */}
                                    <View style={[
                                        styles.timelineDot,
                                        { backgroundColor: isExit ? '#f59e0b' : '#16a34a' }
                                    ]}>
                                        <Ionicons
                                            name={isExit ? 'exit-outline' : 'enter-outline'}
                                            size={14}
                                            color="white"
                                        />
                                    </View>

                                    {/* Content Card */}
                                    <View style={[
                                        styles.logCard,
                                        {
                                            borderLeftColor: isExit ? '#f59e0b' : '#16a34a',
                                            backgroundColor: colors.card
                                        }
                                    ]}>
                                        {/* Header */}
                                        <View style={styles.logHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <View style={[
                                                    styles.actionBadge,
                                                    { backgroundColor: isExit ? '#fff7ed' : '#f0fdf4' }
                                                ]}>
                                                    <Text style={[
                                                        styles.actionText,
                                                        { color: isExit ? '#f59e0b' : '#16a34a' }
                                                    ]}>
                                                        {isExit ? '← OUT' : '→ IN'}
                                                    </Text>
                                                </View>

                                                {/* Late Badge - Moved here */}
                                                {log.isLate && !isExit && (
                                                    <View style={[styles.lateBadge, { backgroundColor: '#fff7ed' }]}>
                                                        <Ionicons name="time" size={10} color="#ea580c" />
                                                        <Text style={[styles.lateText, { color: '#ea580c' }]}>LATE</Text>
                                                    </View>
                                                )}
                                            </View>

                                            <Text style={[styles.timeAgo, { color: colors.textTertiary }]}>{getTimeAgo(log.timestamp)}</Text>
                                        </View>

                                        {/* Student Info */}
                                        <Text style={[styles.studentName, { color: colors.text }]}>{log.user?.name || 'Unknown'}</Text>
                                        <Text style={[styles.studentInfo, { color: colors.textSecondary }]}>
                                            {log.user?.rollNo} • Room {log.user?.room} • {log.user?.hostel}
                                        </Text>
                                        <Text style={styles.phoneInfo}>📞 {log.user?.phone || 'N/A'}</Text>

                                        {/* Footer */}
                                        <View style={[styles.logFooter, { borderTopColor: colors.cardBorder }]}>
                                            <Text style={[styles.passReason, { color: colors.textSecondary }]} numberOfLines={2}>
                                                {isExit ? (
                                                    `Going for: ${log.gatePass?.reason || 'Gate Pass'}`
                                                ) : (
                                                    log.isLate ?
                                                        `⚠️ Returned ${log.note ? log.note.replace('Student returned ', '') : 'late'}` :
                                                        `✅ Returned on time`
                                                )}
                                            </Text>
                                            <Text style={[styles.timeStamp, { color: colors.text }]}>{formatTime(log.timestamp)}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color="#d4d4d4" />
                        <Text style={styles.emptyTitle}>No Activity</Text>
                        <Text style={styles.emptyText}>No entry/exit logs recorded today</Text>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#737373', fontSize: 14 },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 20, fontWeight: '700', color: '#0a0a0a' },
    statLabel: { fontSize: 11, color: '#737373', fontWeight: '500' },
    statDivider: { width: 1, backgroundColor: '#e5e5e5', marginHorizontal: 8 },

    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },

    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },

    // Timeline
    timeline: { position: 'relative' },
    logItem: { flexDirection: 'row', marginBottom: 16, position: 'relative' },
    timelineLine: {
        position: 'absolute',
        left: 14,
        top: 32,
        bottom: -16,
        width: 2,
        backgroundColor: '#e5e5e5',
    },
    timelineDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        zIndex: 1,
    },

    // Log Card
    logCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 14,
        borderLeftWidth: 3,
    },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    actionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    actionText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    lateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
    lateText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    timeAgo: { fontSize: 12, color: '#a3a3a3' },

    studentName: { fontSize: 16, fontWeight: '600', color: '#0a0a0a', marginBottom: 2 },
    studentInfo: { fontSize: 13, color: '#525252', marginBottom: 2 },
    phoneInfo: { fontSize: 12, color: '#1d4ed8', marginBottom: 10 },

    logFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    passReason: { flex: 1, fontSize: 12, color: '#737373' },
    timeStamp: { fontSize: 12, fontWeight: '600', color: '#0a0a0a' },

    // Empty State
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#0a0a0a', marginTop: 12 },
    emptyText: { fontSize: 14, color: '#a3a3a3', marginTop: 4 },
});
