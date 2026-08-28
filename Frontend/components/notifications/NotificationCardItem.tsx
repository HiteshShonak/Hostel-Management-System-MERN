import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { AppNotification } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface NotificationCardItemProps {
    notification: AppNotification;
    onPress: (notification: AppNotification) => void;
    onLongPress: (id: string) => void;
}

const getNotificationIcon = (type: string): string => {
    switch (type) {
        case 'notice': return 'megaphone';
        case 'gatepass': return 'ticket';
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

/**
 * Individual notification item card with unread badge and action trigger.
 */
export function NotificationCardItem({
    notification,
    onPress,
    onLongPress,
}: NotificationCardItemProps) {
    const { colors, isDark } = useTheme();

    const formattedDate = new Date(notification.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
    });
    const formattedTime = formatTime(notification.createdAt);

    return (
        <Pressable
            style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                !notification.read && {
                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                    borderColor: colors.primary,
                },
            ]}
            onPress={() => onPress(notification)}
            onLongPress={() => onLongPress(notification._id)}
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
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {notification.title}
                    </Text>
                    {!notification.read && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                    )}
                </View>
                <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                    {notification.message}
                </Text>
                <Text style={[styles.time, { color: colors.textTertiary }]}>
                    {`${formattedDate}, ${formattedTime}`}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        gap: 12,
    },
    iconBox: {
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
        fontWeight: '600',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    message: {
        fontSize: 14,
        marginTop: 4,
    },
    time: {
        fontSize: 12,
        marginTop: 8,
    },
});
