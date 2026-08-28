import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadMore } from '@/components/ui/LoadMore';
import { useTheme } from '@/lib/contexts/theme';
import {
    useNotificationsController,
    NotificationCardItem,
    NotificationsEmptyState,
} from '@/components/notifications';

export default function NotificationsPage() {
    const { colors, isDark } = useTheme();
    const {
        allNotifications,
        isLoading,
        isFetching,
        page,
        data,
        refreshing,
        unreadCount,
        handleRefresh,
        handleLoadMore,
        handleNotificationPress,
        handleDelete,
        handleMarkAllAsRead,
    } = useNotificationsController();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Notifications" showBack />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* button to mark all as read */}
                {unreadCount > 0 && (
                    <Pressable
                        style={[styles.markAllBtn, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}
                        onPress={handleMarkAllAsRead}
                    >
                        <Ionicons name="checkmark-done" size={18} color={colors.primary} />
                        <Text style={[styles.markAllText, { color: colors.primary }]}>
                            Mark all as read ({unreadCount})
                        </Text>
                    </Pressable>
                )}

                {isLoading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : allNotifications && allNotifications.length > 0 ? (
                    <View style={styles.list}>
                        {allNotifications.map((notification) => (
                            <NotificationCardItem
                                key={notification._id}
                                notification={notification}
                                onPress={handleNotificationPress}
                                onLongPress={handleDelete}
                            />
                        ))}

                        <LoadMore
                            onLoadMore={handleLoadMore}
                            isLoading={isFetching && page > 1}
                            hasMore={data?.pagination?.hasNext || false}
                            loadedCount={allNotifications.length}
                            totalCount={data?.pagination?.total}
                        />
                    </View>
                ) : (
                    <NotificationsEmptyState />
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
});
