import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { PRIMARY_COLOR } from '@/lib/constants';
import { useTheme } from '@/lib/contexts/theme';
import {
    useActivityLogsController,
    ActivityStatsBar,
    ActivityLogCard,
} from '@/components/guard';

export default function ActivityLogsScreen() {
    const { colors } = useTheme();
    const {
        logs,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        getTimeAgo,
        exitCount,
        entryCount,
    } = useActivityLogsController();

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Activity Logs" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading logs...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Activity Logs" showBack />

            {/* Stats Bar */}
            <ActivityStatsBar
                exitCount={exitCount}
                entryCount={entryCount}
                totalCount={logs.length}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
                }
            >
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Today's Activity</Text>

                {logs.length > 0 ? (
                    <View style={styles.timeline}>
                        {logs.map((log, index) => (
                            <ActivityLogCard
                                key={log._id}
                                log={log}
                                isLast={index === logs.length - 1}
                                formatTime={formatTime}
                                getTimeAgo={getTimeAgo}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activity</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No entry/exit logs recorded today</Text>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#737373', fontSize: 14 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    timeline: { position: 'relative' },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
    emptyText: { fontSize: 14, marginTop: 4 },
});
