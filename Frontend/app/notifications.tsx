import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadMore } from '@/components/ui/LoadMore';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification, useRefreshDashboard } from '@/lib/hooks';
import { AppNotification } from '@/lib/types';
import { useTheme } from '@/lib/theme-context';

const getNotificationIcon = (type: string): string => {
    switch (type) {
        case 'notice': return 'megaphone';
        case 'gatepass': return 'card';
        case 'complaint': return 'chatbox-ellipses';
        case 'system': return 'settings';
        default: return 'notifications';
    }
};

const getNotificationColor = (type: string): string => {
    switch (type) {
        case 'notice': return '#f59e0b';
        case 'gatepass': return '#1d4ed8';
        case 'complaint': return '#10b981';
        case 'system': return '#6b7280';
        default: return '#1d4ed8';
    }
};

export default function NotificationsPage() {
    const { colors, isDark } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const deleteMutation = useDeleteNotification();

    // Pagination state
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
    const LIMIT = 15;

    const { data, isLoading, isFetching } = useNotifications(page, LIMIT);

    // Accumulate notifications when page changes
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllNotifications(data.data);
            } else {
                setAllNotifications(prev => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    // Reset on refresh
    const handleRefresh = async () => {
        setPage(1);
        setAllNotifications([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const handleNotificationPress = (notification: AppNotification) => {
        // Mark as read
        if (!notification.read) {
            markAsReadMutation.mutate(notification._id);
        }
        // Navigate to the link if available
        if (notification.link) {
            router.push(notification.link as any);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
            ]
        );
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const unreadCount = allNotifications?.filter((n) => !n.read).length || 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Notifications" showBack />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {/* Mark all as read button */}
                {unreadCount > 0 && (
                    <Pressable
                        style={[styles.markAllBtn, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}
                        onPress={handleMarkAllAsRead}
                    >
                        <Ionicons name="checkmark-done" size={18} color={colors.primary} />
                        <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all as read ({unreadCount})</Text>
                    </Pressable>
                )}

                {isLoading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : allNotifications && allNotifications.length > 0 ? (
                    <View style={styles.list}>
                        {allNotifications.map((notification: AppNotification) => (
                            <Pressable
                                key={notification._id}
                                style={[
                                    styles.card,
                                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                                    !notification.read && { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.primary }
                                ]}
                                onPress={() => handleNotificationPress(notification)}
                                onLongPress={() => handleDelete(notification._id)}
                            >
                                <View style={[styles.iconBox, { backgroundColor: `${getNotificationColor(notification.type)}20` }]}>
                                    <Ionicons
                                        name={getNotificationIcon(notification.type) as any}
                                        size={20}
                                        color={getNotificationColor(notification.type)}
                                    />
                                </View>
                                <View style={styles.content}>
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{notification.title}</Text>
                                        {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                                    </View>
                                    <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>{notification.message}</Text>
                                    <Text style={[styles.time, { color: colors.textTertiary }]}>
                                        {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}

                        {/* Load More Button */}
                        <LoadMore
                            onLoadMore={handleLoadMore}
                            isLoading={isFetching && page > 1}
                            hasMore={data?.pagination?.hasNext || false}
                            loadedCount={allNotifications.length}
                            totalCount={data?.pagination?.total}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notifications</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You're all caught up!</Text>
                    </View>
                )}
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 64 },
    markAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, marginBottom: 16, borderRadius: 10 },
    markAllText: { fontWeight: '600' },
    list: { gap: 12 },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        gap: 12,
    },
    iconBox: { padding: 10, borderRadius: 10, alignSelf: 'flex-start' },
    content: { flex: 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { flex: 1, fontWeight: '600' },
    unreadDot: { width: 8, height: 8, borderRadius: 4 },
    message: { fontSize: 14, marginTop: 4 },
    time: { fontSize: 12, marginTop: 8 },
    emptyState: { alignItems: 'center', padding: 48 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptyText: { fontSize: 14, marginTop: 4 },
});
