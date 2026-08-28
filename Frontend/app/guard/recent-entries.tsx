import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    useRecentEntriesController,
    RecentEntryCard,
} from '@/components/guard';

export default function RecentEntriesScreen() {
    const { colors, isDark } = useTheme();
    const {
        entries,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        formatDate,
        getTimeDiff,
    } = useRecentEntriesController();

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
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {entries.length > 0 ? (
                    entries.map((pass) => (
                        <RecentEntryCard
                            key={pass._id}
                            pass={pass}
                            formatTime={formatTime}
                            formatDate={formatDate}
                            getTimeDiff={getTimeDiff}
                        />
                    ))
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
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    summaryIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: { fontSize: 14, fontWeight: '600' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
    emptyText: { fontSize: 14, marginTop: 4 },
});
