import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
    useNotifications,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead,
    useDeleteNotification,
    useRefreshDashboard,
} from '@/lib/hooks';
import { AppNotification } from '@/lib/types';

const LIMIT = 15;

/**
 * Controller hook for the Notifications screen.
 * Handles pagination state, appending new pages, marking read,
 * batch clearing, and item deletion confirmation.
 */
export function useNotificationsController() {
    const { refreshing, onRefresh } = useRefreshDashboard();
    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const deleteMutation = useDeleteNotification();

    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);

    const { data, isLoading, isFetching } = useNotifications(page, LIMIT);

    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllNotifications(data.data);
            } else {
                setAllNotifications((prev) => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    const handleRefresh = async () => {
        setPage(1);
        setAllNotifications([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage((prev) => prev + 1);
        }
    };

    const handleNotificationPress = (notification: AppNotification) => {
        if (!notification.read) {
            markAsReadMutation.mutate(notification._id);
        }
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
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(id),
                },
            ]
        );
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const unreadCount = allNotifications?.filter((n) => !n.read).length || 0;

    return {
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
    };
}
